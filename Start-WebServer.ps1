<#
.Synopsis
Starts powershell webserver
.Description
Starts webserver as powershell process.
Call of the root page (e.g. http://localhost:8080/) returns a powershell execution web form.
Call of /script uploads a powershell script and executes it (as a function).
Call of /log returns the webserver logs, /starttime the start time of the webserver, /time the current time.
/download downloads and /upload uploads a file. /beep generates a sound and /quit or /exit stops the webserver.

You may have to configure a firewall exception to allow access to the chosen port, e.g. with:
  netsh advfirewall firewall add rule name="Powershell Webserver" dir=in action=allow protocol=TCP localport=8080

After stopping the webserver you should remove the rule, e.g.:
  netsh advfirewall firewall delete rule name="Powershell Webserver"
.Parameter BINDING
Binding of the webserver
.Inputs
None
.Outputs
None
.Example
Start-Webserver.ps1

Starts webserver with binding to http://localhost:8080/
.Example
Start-Webserver.ps1 "http://+:8080/"

Starts webserver with binding to all IP addresses of the system.
Administrative rights are necessary.
.Example
schtasks.exe /Create /TN "Powershell Webserver" /TR "powershell -file C:\<path_to_script>\Start-WebServer.ps1 http://+:8080/" /SC ONSTART /RU SYSTEM /RL HIGHEST /F

Starts powershell webserver as scheduled task as user local system every time the computer starts (when the
correct path to the file Start-WebServer.ps1 is given).
You can start the webserver task manually with
  schtasks.exe /Run /TN "Powershell Webserver"
Delete the webserver task with
  schtasks.exe /Delete /TN "Powershell Webserver"
Scheduled tasks are always running with low priority, so some functions might be slow.
.Notes
Author: Markus Scholtes, 2016-10-22
Modified by: Lino Telera, 2017-08-29
#>
Param([STRING]$BINDING = 'http://localhost:8080/')

# No adminstrative permissions are required for a binding to "localhost"
# $BINDING = 'http://localhost:8080/'
# Adminstrative permissions are required for a binding to network names or addresses.
# + takes all requests to the port regardless of name or ip, * only requests that no other listener answers:
# $BINDING = 'http://+:8080/'

# HTML answer templates for specific calls, placeholders !RESULT, !FORMFIELD, !PROMPT are allowed
$HTMLRESPONSECONTENTS = @{
  'GET /'  =  @"
<html><body>
	!HEADERLINE
	<pre>!RESULT</pre>
"@
  'GET /page'  =  @"
<html><body>!HEADERLINE
	<pre>!RESULT</pre>
	<form method="GET" action="/page">
	<b>PAGE&nbsp;</b><input type="text" maxlength=255 size=80 name="page" value='index.html'>
  <input type="submit" name="button" value="Enter">
	</form>
</body></html>
"@
  'GET /script'  =  @"
<html><body>
	!HEADERLINE
	<form method="POST" enctype="multipart/form-data" action="/script">
	<p><b>Script to execute:</b><input type="file" name="filedata"></p>
	<b>Parameters:</b><input type="text" maxlength=255 size=80 name="parameter">
  <input type="submit" name="button" value="Execute">
	</form>
</body></html>
"@
  'POST /script' = "<html><body>!HEADERLINE<pre>!RESULT</pre></body></html>"
  'POST /upload' = "<html><body>!HEADERLINE<pre>!RESULT</pre></body></html>"
  'GET /exit' = "<html><body>Stopped powershell webserver</body></html>"
  'GET /quit' = "<html><body>Stopped powershell webserver</body></html>"
  'GET /log' = "<html><body>!HEADERLINELog of powershell webserver:<br /><pre>!RESULT</pre></body></html>"
  'GET /starttime' = "<html><body>!HEADERLINEPowershell webserver started at $(Get-Date -Format s)</body></html>"
  'GET /time' = "<html><body>!HEADERLINECurrent time: !RESULT</body></html>"

}

# Set navigation header line for all web pages
$HEADERLINE = "<p><a href='/'>Command execution</a> <a href='/page'>Page</a> <a href='/script'>Execute script</a> <a href='/log'>Web logs</a> <a href='/starttime'>Webserver start time</a> <a href='/time'>Current time</a> <a href='/quit'>Stop webserver</a></p>"

# Starting the powershell webserver
"$(Get-Date -Format s) Starting powershell webserver..."
$LISTENER = New-Object System.Net.HttpListener
$LISTENER.Prefixes.Add($BINDING)
$LISTENER.Start()
$EXT = ""
$Error.Clear()

$COMMANDRETURN = $FALSE

try{
    "$(Get-Date -Format s) Powershell webserver started."
    $WEBLOG = "$(Get-Date -Format s) Powershell webserver started.`n"
    while ($LISTENER.IsListening){
        # analyze incoming request
        $CONTEXT = $LISTENER.GetContext()
        $REQUEST = $CONTEXT.Request
        $RESPONSE = $CONTEXT.Response
        $RESPONSEWRITTEN = $FALSE

        # log to console
        "$(Get-Date -Format s) $($REQUEST.RemoteEndPoint.Address.ToString()) $($REQUEST.httpMethod) $($REQUEST.Url.PathAndQuery)"
        # and in log variable
        $WEBLOG += "$(Get-Date -Format s) $($REQUEST.RemoteEndPoint.Address.ToString()) $($REQUEST.httpMethod) $($REQUEST.Url.PathAndQuery)`n"

        # is there a fixed coding for the request?
        $RECEIVED = '{0} {1}' -f $REQUEST.httpMethod, $REQUEST.Url.LocalPath
        $HTMLRESPONSE = $HTMLRESPONSECONTENTS[$RECEIVED]
	      $RESULT = ''

        # check for known commands
        switch ($RECEIVED){
            "GET /" {	# execute command
	  		    # retrieve GET query string
	  		    $FORMFIELD = ''
	    	    $FORMFIELD = [URI]::UnescapeDataString(($REQUEST.Url.Query -replace "\+"," "))
	    	    # remove fixed form fields out of query string
	    	    $FORMFIELD = $FORMFIELD -replace "\?command=","" -replace "\?button=enter","" -replace "&command=","" -replace "&button=enter",""
	    	    # when command is given...
    		    if (![STRING]::IsNullOrEmpty($FORMFIELD)){
    		    
    		    
		    	    try {
		    		    # ... execute command
		    		    $COMMANDRETURN = $TRUE
		    		    $RESULT = Invoke-Expression -EA SilentlyContinue $FORMFIELD 2> $NULL | Out-String
		    	    }catch	{}
		    	    if ($Error.Count -gt 0){ # retrieve error message on error
		    		    $RESULT += "`nError while executing '$FORMFIELD'`n`n"
		    		    $RESULT += $Error[0]
		    		    $Error.Clear()
		    	    }
	    	    }else{
	    	    		$RESULT = '<form method="GET" action="/"><b>PS $PWD&gt;</b><input type="text" maxlength=255 size=80 name="command" value=""><input type="submit" name="button" value="Enter"></form></body></html>'
	    	    }
	    	   
                break
            }

            "GET /script"{ # present upload form, nothing to do here
      	        break; 
            }

            "POST /script"{ # upload and execute script

      	        # only if there is body data in the request
      	        if ($REQUEST.HasEntityBody){
      		        # set default message to error message (since we just stop processing on error)
      		        $RESULT = "Received corrupt or incomplete form data"

      		        # check content type
      		        if ($REQUEST.ContentType){
						# retrieve boundary marker for header separation
						$BOUNDARY = $NULL
						if ($REQUEST.ContentType -match "boundary=(.*);"){	
                            $BOUNDARY = "--" + $MATCHES[1] 
                        }else{ # marker might be at the end of the line
							if ($REQUEST.ContentType -match "boundary=(.*)$"){ 
                                $BOUNDARY = "--" + $MATCHES[1] 
                            }
						}

	      		        if ($BOUNDARY){ 
                            # only if header separator was found
							# read complete header (inkl. file data) into string
      				        $READER = New-Object System.IO.StreamReader($REQUEST.InputStream, $REQUEST.ContentEncoding)
							$DATA = $READER.ReadToEnd()
							$READER.Close()
							$REQUEST.InputStream.Close()

							$PARAMETERS = ""
							$SOURCENAME = ""

							# separate headers by boundary string
							$DATA -replace "$BOUNDARY--\r\n", "$BOUNDARY`r`n--" -split "$BOUNDARY\r\n" | % {
								# omit leading empty header and end marker header
								if (($_ -ne "") -and ($_ -ne "--")){
									# only if well defined header (separation between meta data and data)
									if ($_.IndexOf("`r`n`r`n") -gt 0){
										# header data before two CRs is meta data
										# first look for the file in header "filedata"
										if ($_.Substring(0, $_.IndexOf("`r`n`r`n")) -match "Content-Disposition: form-data; name=(.*);"){
											$HEADERNAME = $MATCHES[1] -replace '\"'
											# headername "filedata"?
											if ($HEADERNAME -eq "filedata"){ 
                                                # yes, look for source filename
												if ($_.Substring(0, $_.IndexOf("`r`n`r`n")) -match "filename=(.*)"){ 
                                                    # source filename found
													$SOURCENAME = $MATCHES[1] -replace "`r`n$" -replace "`r$" -replace '\"'
													# store content of file in variable
													$FILEDATA = $_.Substring($_.IndexOf("`r`n`r`n") + 4) -replace "`r`n$"
                                                }
											}
										}else{ 
                                            # look for other headers (we need "parameter")
											if ($_.Substring(0, $_.IndexOf("`r`n`r`n")) -match "Content-Disposition: form-data; name=(.*)"){ 
                                                # header found
												$HEADERNAME = $MATCHES[1] -replace '\"'
												# headername "parameter"?
												if ($HEADERNAME -eq "parameter"){ 
                                                    # yes, look for paramaters
													$PARAMETERS = $_.Substring($_.IndexOf("`r`n`r`n") + 4) -replace "`r`n$" -replace "`r$"
												}
											}
										}
									}
								}
							}

							if ($SOURCENAME -ne ""){
                                # execute only if a source file exists
								$EXECUTE = "function Powershell-WebServer-Func {`n" + $FILEDATA + "`n}`nPowershell-WebServer-Func " + $PARAMETERS
		    				    try {
		    					    # ... execute script
		    					    $RESULT = Invoke-Expression -EA SilentlyContinue $EXECUTE 2> $NULL | Out-String
		    				    }catch	{}
		    				
                                if ($Error.Count -gt 0){ 
                                    # retrieve error message on error
		    					    $RESULT += "`nError while executing script $SOURCENAME`n`n"
		    					    $RESULT += $Error[0]
		    					    $Error.Clear()
		    				    }
						    }else{
								$RESULT = "No file data received"
							}
      			        }
					}
      	        }else{
      		        $RESULT = "No client data received"
      	        }
      	        break
            }


            "GET /log"{ 
                # return the webserver log (stored in log variable)
      	        $RESULT = $WEBLOG
      	        break
            }

            "GET /time"{ 
                # return current time
      	        $RESULT = Get-Date -Format s
      	        break
            }

            "GET /starttime"{ 
                # return start time of the powershell webserver (already contained in $HTMLRESPONSE, nothing to do here)
      	        break
            }

            
            "GET /quit"{ # stop powershell webserver, nothing to do here
      	        break
            }

            "GET /exit"{ # stop powershell webserver, nothing to do here
      	        break
            }

      
            "GET /page"{ # present page
      	
                # retrieve GET query string
	  		    $FORMFIELD = ''
	    	    $FORMFIELD = [URI]::UnescapeDataString(($REQUEST.Url.Query -replace "\+"," "))
	    	    # remove fixed form fields out of query string
	    	    $FORMFIELD = $FORMFIELD -replace "\?page=","" -replace "\?button=enter","" -replace "&page=","" -replace "&button=enter",""
	    	    # when command is given...
    		    if (![STRING]::IsNullOrEmpty($FORMFIELD)){
		    	    try {
		    		    
                        $HTMLRESPONSE = Get-Content $($PSScriptRoot + "/"+$FORMFIELD)
		    	    }catch	{
                        $RESPONSE.StatusCode = 404
                        $HTMLRESPONSE = "<html><body><h1>File not found</h1></body></html>"
                    }
	    	    }
           
      
                break
            }

            default{	
 
                #Try to find page
                try {
            		$EXT = [IO.Path]::GetExtension($($PSScriptRoot + "/" + $($RECEIVED -replace "GET /")))
            		
            		$HTMLRESPONSE = [System.IO.File]::ReadAllText( $($PSScriptRoot + "/" + $($RECEIVED -replace "GET /") ))
            		
            		if ($EXT -eq ".gif"){
            			$HTMLRESPONSE = [System.IO.File]::ReadAllBytes( $($PSScriptRoot + "/" + $($RECEIVED -replace "GET /") ))
            		}
            		if ($EXT -eq ".jpg"){
            			$HTMLRESPONSE = [System.IO.File]::ReadAllBytes( $($PSScriptRoot + "/" + $($RECEIVED -replace "GET /") ))
            		}
            		
            		if ($EXT -eq ".png"){
            			$HTMLRESPONSE = [System.IO.File]::ReadAllBytes( $($PSScriptRoot + "/" + $($RECEIVED -replace "GET /") ))
            		}
            		
            		
                    
                     
		        }catch	{
                    "Error"
                    $RESPONSE.StatusCode = 404
                    $HTMLRESPONSE = "<html><body><h1>File not found</h1></body></html>"
                }

            }

        }

		

		$BUFFER = [Text.Encoding]::UTF8.GetBytes($HTMLRESPONSE)
		
		#Write-Host $BUFFER

        # only send response if not already done
        if (!$RESPONSEWRITTEN -and $RESPONSE.StatusCode -eq 200){
 			       
    	    if ($EXT -ne ""){
    	    	
    	    	if ($EXT -eq ".html"){
    	    		
        			$RESPONSE.Headers.Add("Content-Type","text/html")
        		}
        		if ($EXT -eq ".js"){
        			
        			$RESPONSE.Headers.Add("Content-Type","application/javascript")
        		}
        		if ($EXT -eq ".css"){
        			
        			$RESPONSE.Headers.Add("Content-Type","text/css")
        		}
        		if ($EXT -eq ".html"){
        			
        			$RESPONSE.Headers.Add("Content-Type","text/html")
        		}
        		if ($EXT -eq ".gif"){
        			$BUFFER = $HTMLRESPONSE
        			$RESPONSE.Headers.Add("Content-Type","image/gif")
        		}
        		if ($EXT -eq ".jpg"){
        			$BUFFER = $HTMLRESPONSE
        			$RESPONSE.Headers.Add("Content-Type","image/jpg")
        		}
        		if ($EXT -eq ".png"){
        			$BUFFER = $HTMLRESPONSE
        			$RESPONSE.Headers.Add("Content-Type","image/png")
        		}
        		
        		
        	}elseif ( $COMMANDRETURN ){
        		 # return HTML answer to caller
    	    	# insert header line string into HTML template
		   		#$HTMLRESPONSE = $HTMLRESPONSE -replace '!HEADERLINE', ""
		    	# insert result string into HTML template
		   		$HTMLRESPONSE = $RESULT
		   		$BUFFER = [Text.Encoding]::UTF8.GetBytes($HTMLRESPONSE)
        	}else{
        		 # return HTML answer to caller
    	    	# insert header line string into HTML template
		   		$HTMLRESPONSE = $HTMLRESPONSE -replace '!HEADERLINE', $HEADERLINE
		    	# insert result string into HTML template
		   		$HTMLRESPONSE = $HTMLRESPONSE -replace '!RESULT', $RESULT
		   		$BUFFER = [Text.Encoding]::UTF8.GetBytes($HTMLRESPONSE)
        	}
    	    $EXT = ""
    	    $RESPONSE.StatusCode = 200
    	    
		}
		
		
		$RESPONSE.ContentLength64 = $BUFFER.Length
    	$RESPONSE.OutputStream.Write($BUFFER, 0, $BUFFER.Length)
		
	
        # and finish answer to client
        $RESPONSE.Close()

        # received command to stop webserver?
        if ($RECEIVED -eq 'GET /exit' -or $RECEIVED -eq 'GET /quit'){ # then break out of while loop
    	    "$(Get-Date -Format s) Stopping powershell webserver..."
    	    break;
        }
    }
}finally{
    # Stop powershell webserver
    $LISTENER.Stop()
    $LISTENER.Close()
    "$(Get-Date -Format s) Powershell webserver stopped."
}
