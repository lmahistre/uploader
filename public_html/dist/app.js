
function bulkUploaderInit() {
	// $('#file_upload_button').on('click', function() {
	// 	$('#file_upload').click();
	// })

	var setFileError = function(file) {
		console.error(file);
		// $('#list_subpanel_documents>table.list.view>tbody>tr[data-document-name="'+file.name+'"] td:eq(0)').html('<img src="themes/default/ext/resources/images/gray/window/icon-error.gif" style="width: 15px;height: 15px;">');
		// $('#list_subpanel_documents>table.list.view>tbody>tr[data-document-name="'+file.name+'"] td:eq(5)').html('\n\
		// 	<i style="color:red;">Erreur</i>\n\
		// ');
		// $('#list_subpanel_documents>table.list.view>tbody>tr[data-document-name="'+file.name+'"] td:eq(6)').html('\n\
		// 	<i style="color:red;">'+file.error+'</i>\n\
		// ');
		// $('#list_subpanel_documents>table.list.view>tbody>tr[data-document-name="'+file.name+'"]').removeAttr('data-document-name');
	}

	$('#file_upload').fileupload({
		dataType: 'json',
		url: 'upload.php',
		done: function (e, data) {
			for (var i=0; i<data.files.length; i++) {
				if ($('#list_subpanel_documents>table.list.view>tbody>tr[data-document-name="'+data.files[i].name+'"]').length) {
					data.files[i].error = 'Erreur fichier';
					setFileError(data.files[i]);
				}
			};
		},
		autoUpload: true,
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|odt|ods|doc|docx|ppt|pptx|xls|xlsx)$/i,
		maxFileSize: 65000000, // 65 MB
		limitMultiFileUploads: 1,
		sequentialUploads: true,
		disableImageResize: true,
		previewMaxWidth: 60,
		previewMaxHeight: 60,
		previewCrop: false
	})
	.on('fileuploadadd', function (e, data) {
		for (var i=0; i<data.files.length; i++) {
			$('#upload_list').append('<div>'+data.files[i].name+'</div>');
		}
	})
	.on('fileuploaddone', function (e, data) {
		var files = [];
		if (data._response && data._response.result && data._response.result.files) {
			files = data._response.result.files;
		}
		else {
			files = data.files;
		}
		console.log('fileuploaddone');
		console.log(files);
	})
	.on('fileuploadfail', function (e, data) {
		for (var i=0; i<data.files.length; i++) {
			setFileError(data.files[i]);
		}
	});
};

// bulkUploaderInit();
setTimeout(bulkUploaderInit, 1000);