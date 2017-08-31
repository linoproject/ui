/**
 * Module for displaying "Waiting for..." dialog using Bootstrap
 *
 * @author Eugene Maslovich <ehpc@em42.ru>
 */

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;background-color: rgba(255, 255, 255, 1);">' +
		'<div class="modal-dialog modal-m">' +
	
		'</div></div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
				if (global_wait_dialog_opt){
					options = global_wait_dialog_opt;
				}
			}
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			
			
			
			
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null, // This callback runs after the dialog was hidden
				img: '',
			}, options);

			
			
			if (settings.img){
				
				if ($dialog.find('.modal-img').length == 0){
					$dialog.find('.modal-dialog').append('<div class="modal-img"><img style="" src="'+settings.img+'"></div>');
				}
				
			}else{
				
				if ($dialog.find('.modal-body').length == 0){
					$dialog.find('.modal-dialog').append('<div class="modal-content"><div class="modal-header"><h3 style="margin:0;"></h3></div>' +
							'<div class="modal-body">' +
							'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
							'</div></div>');

				}
								
				$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
				$dialog.find('.progress-bar').attr('class', 'progress-bar');
				if (settings.progressType) {
					$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
				}
				
				$dialog.find('h3').text(message);
			}
			// Configuring dialog
			
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
			setTimeout(function(){
				// Send error
				this.hide();
			
			}.bind(this), 30000);
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);
