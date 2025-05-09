$(document).ready(function() {
    // Animate hero section on load
    $('.hero-section h1').addClass('animate__fadeInDown');
    $('.hero-section p').addClass('animate__fadeInUp');

    // Numbers API AJAX call
    $.ajax({
        url: 'http://numbersapi.com/1/30/date?json',
        method: 'GET',
        success: function(data) {
            $('#numbers-fact').text(data.text);
        },
        error: function() {
            $('#numbers-fact').text('Could not load fun fact.');
        }
    });

    // Drag and drop upload
    var dropArea = $('#drop-area');
    var fileInput = $('#fileElem');
    var gallery = $('#gallery');
    var uploadBtn = $('#uploadBtn');
    var selectedFiles = [];

    dropArea.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.addClass('dragover');
    });
    dropArea.on('dragleave dragend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.removeClass('dragover');
    });
    dropArea.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.removeClass('dragover');
        var files = e.originalEvent.dataTransfer.files;
        handleFiles(files);
    });
    $('.upload-btn').on('click', function() {
        fileInput.click();
    });
    fileInput.on('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        selectedFiles = [];
        gallery.empty();
        for (let i = 0; i < files.length; i++) {
            selectedFiles.push(files[i]);
            previewFile(files[i]);
        }
        if (selectedFiles.length > 0) {
            uploadBtn.removeClass('d-none');
        } else {
            uploadBtn.addClass('d-none');
        }
    }
    function previewFile(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            let img = $('<img>').attr('src', reader.result);
            gallery.append(img.hide().fadeIn(600));
        }
    }

    uploadBtn.on('click', function() {
        if (selectedFiles.length === 0) return;
        let uploads = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            uploads.push(uploadFile(selectedFiles[i]));
        }
        Promise.all(uploads).then(function() {
            $('#uploadMsg').html('<div class="alert alert-success">Successfully uploaded file(s)!</div>');
            uploadBtn.addClass('d-none');
            selectedFiles = [];
            fileInput.val("");
        }).catch(function() {
            $('#uploadMsg').html('<div class="alert alert-danger">Error uploading file(s). Please try again.</div>');
        });
    });

    function uploadFile(file) {
        return new Promise(function(resolve, reject) {
            let formData = new FormData();
            formData.append('image', file);
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                    resolve();
                },
                error: function() {
                    reject();
                }
            });
        });
    }

    // Animate features on scroll
    $(window).on('scroll', function() {
        $('.feature-box').each(function(i, el) {
            if ($(el).offset().top < $(window).scrollTop() + $(window).height() - 50) {
                $(el).addClass('animate__fadeInUp');
            }
        });
    });
}); 