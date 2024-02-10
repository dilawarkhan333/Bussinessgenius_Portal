// Investor profile script

var base_url = Beard.root;

var initCropper = function(){
    function userBannerCrop() {
        var image = document.getElementById('user-image-upload');
        var cropBoxData;
        var canvasData;
        var cropInit;
        cropInit = new Cropper(image, {
            autoCropArea: 1,
            aspectRatio: 16 / 4,
            built: function () {
                // Strict mode: set crop box data first
                cropInit.setCropBoxData(cropBoxData).setCanvasData(canvasData);
            }
        });
        cropper = cropInit;
    }

    function readUserURL(input, pid) {
        if (input.files && input.files[0]) {
            $("#js-user-cover-modal").find("#js-cover-loading-div").html('<div style="padding:100px;"><div class="loading"></div></div>');
            $("#js-user-cover-modal").modal('show');
            jic.imagecompress(input.files[0], function (response) {
                $("#js-user-cover-modal").find("#js-cover-loading-div").html('<img src="' + response + '" id="user-image-upload" style="width:100%;">');
                setTimeout(function () {
                    userBannerCrop();
                }, 500);

            });
        }
    }

    $(document).ready(function () {
        $("#js-user-cover").change(function (e) {
            e.preventDefault();
            var userid = $(this).attr('user-id');
            readUserURL(this, userid);
        });

        $(".js-User-Cover-Crop").click(function () {
            $("#js-user-cover-loading-div").html("<img src='" + base_url + "assets/img/ajax-loader.gif'>");
            $(".js-user-crop-wrapper").hide();
            croppedCanvas = cropper.getCroppedCanvas();
            var Image = croppedCanvas.toDataURL();
            var userid = $('#js-user-id').val();
            Notifier.success(labels.cropping);
            $.ajax({
                type: "POST",
                cache: false,
                url: base_url + 'investor/crop_investor_cover_photo',
                data: {imgpath: Image, uid: userid},
                dataType: 'json',
                success: function (response) {
                    //var path = base_url + 'investor/get_investor_cover_photo/' + response.background_name + '/' + userid;
                    var path = response.image_src;
                    $("#cover-wrapper").html('<img src="' + path + '" class="uploaded-background">');
                    $("#js-cover-loading-div").html('<img src="' + path + '" id="image" style="max-width:100%;">');
                    $("#js-crop-cover").attr('href', base_url + 'overlay/crop_cover/profile/' + userid + '/' + response.background_name + '/0');
                    Notifier.success(response.msg);
                    $("#js-user-cover-modal").modal('hide');
                    //$("#js-user-cover-modal").find(".cm-footer").html('');
                    $(".js-cover-tool").show();
                    $(".js-user-crop-wrapper").show();
                    cropper.destroy();
                }
            });
        });

        $('.js-bck-image-uploader-profile').each(function () {
            pointer = $(this);
            button = $(this).find('input.uploader-data');
            dev = $(this).find('.fileUploader');
            data_url = button.attr('data-url');
            button_text = button.attr('button-text');
            multiple_val = button.attr('multiple-val');
            var image = $(this).find('img.uploaded-background');
            object_id = button.attr('data-object-id');
            var user_id = button.attr('data-object-id');
            var name_input = $(this).find('input.bck-image-name');
            uploader = new qq.FileUploader({
                action: data_url,
                element: dev[0], //document.getElementById('fileUploader'),
                uploadButtonText: button_text,
                multiple: multiple_val,
                template: '<div class="qq-uploader">' +
                        '<div class="qq-upload-drop-area"><span>{dragText}</span></div>' +
                        '<div type="hidden" class="uploader qq-upload-button">{uploadButtonText}</div>' +
                        '<ul class="qq-upload-list"></ul>' +
                        '</div>',
                params: {
                    object_id: object_id,
                },
                onComplete: function (id, fileName, responseJSON) {
                    if (responseJSON.success) {
                        pointer.find('.qq-upload-list').html('');
                        $('.qq-upload-list').html('');
                        $('img.uploaded-background').attr('src', responseJSON.uri).hide();
                        $("#cover-wrapper").html('<img src="' + responseJSON.uri + '" class="uploaded-background">');
                        $("#js-cover-loading-div").html('<img src="' + responseJSON.uri + '" id="image" style="max-width:100%;">');
                        name_input.val(responseJSON.full_filename);
                        Notifier.success(labels.uploaded_successfully);
                        $("#js-crop-cover").attr('href', base_url + 'overlay/crop_cover/profile/' + user_id + '/' + responseJSON.full_filename + '/0');
                        //$("#js-crop-cover").trigger('click');
                        UserCoverCrop();
                        $(".js-crop-wrapper").show();

                    } else {
                        Notifier.error(labels.allowable_formats);
                    }

                },
                onProgress: function (id, fileName, loaded, total) {
                    var percent = (loaded / total) * 100;
                    //console.log(percent);

                },
                onUpload: function (id, fileName) {
                    $("#js-crop-cover").attr('href', base_url + 'overlay/crop_cover/profile/' + user_id + '/' + name_input + '/0/0');
                    $("#js-crop-cover").trigger('click');
                    $("#js-cover-loading-div").html(labels.uploading);
                    //Notifier.notify(labels.uploading);
                },
                showMessage: function (message) {
                    alert(message);
                },
                debug: true,
            });
        });

        $('.image-uploader').each(function () {
            pointer = $(this);
            button = $(this).find('input.uploader-data');
            dev = $(this).find('.fileUploader');
            data_url = button.attr('data-url');
            button_text = button.attr('button-text');
            multiple_val = button.attr('multiple-val');
            var image = $(this).find('img.uploaded-image');
            object_id = button.attr('data-object-id');
            var name_input = $(this).find('input.image-name');
            uploader = new qq.FileUploader({
                action: data_url,
                element: dev[0], //document.getElementById('fileUploader'),
                uploadButtonText: button_text,
                multiple: multiple_val,
                template: '<div class="qq-uploader">' +
                        // '<div class="qq-upload-drop-area"><span>{dragText}</span></div>' +
                        //'<div class="qq-upload-button">{uploadButtonText}</div>' +
                        '<div type="hidden" class="pro-image-loader qq-upload-button">{uploadButtonText}</div>' +
                        '<ul class="qq-upload-list"></ul>' +
                        '</div>',
                params: {
                    object_id: object_id,
                },
                onComplete: function (id, fileName, responseJSON) {
                    if (responseJSON.success) {
                        pointer.find('.qq-upload-list').html('');
                        $('.qq-upload-list').html('');
                        // $('.change-txt').html('<span class="cng-img"><?= $ph('global:change-image') ?></span>');
                        image.attr('src', responseJSON.uri);
                        name_input.val(responseJSON.full_filename);
                        Notifier.success(labels.uploaded_successfully);
                        $("#delete-profile-image").show();
                        $("#removeCompanyLogo").show();

                    } else {
                        Notifier.error(labels.allowable_formats);
                    }

                },
                onProgress: function (id, fileName, loaded, total) {
                    var percent = (loaded / total) * 100;
                    console.log(percent);
                },
                onUpload: function (id, fileName) {
                    Notifier.notify(labels.uploading);
                },
                showMessage: function (message) {
                    alert(message);
                },
                debug: true,
                extraDropzones: [qq.getByClass(document, 'qq-upload-extra-drop-area')[0]]
            });
            qq.attach(document, 'dragenter', function (e) {
                $('.qq-upload-drop-area').hide();
            });
        });
    });
};

var initProfile = function(){
    $(document).ready(function () {
        $(function () {
            var dotBut = '<div class="button-dot">';
            var totalWidth = $('#slider-range').outerWidth();
            for (var i = 0; i < 10; i++) {
                var pLeft = 11.09 * i;
                dotBut += '<span style="left:' + pLeft + '%"></span>';
            }
            $('#slider-range').append(dotBut);

        });
    });

    // Edit Investor profile ----------------------------------------
    $('#js-profile-save,.js-profile-save').on('click', function () {
        //var postData = $(this).serializeArray();
        param = $("#js-profile-form").serialize();
        var formURL = base_url + 'investor/update_profile_mini';
        //alert(param);return;
        $.ajax(
                {
                    url: formURL,
                    cache: false,
                    async: false,
                    type: "POST",
                    data: param,
                    dataType: "json",
                    success: function (data)
                    {
                        Notifier.success(data.msg);
                        $('#js-min-investment').html("<strong>" + data.data.min_investment + "</strong>");
                        $('#js-max-investment').html("<strong>" + data.data.max_investment + "</strong>");
                        $('#js-investor-type').html("<strong>" + data.data.type + "</strong>");

                        $('.js-profile-edit').show();
                        $('.js-profile-cancel,.js-profile-save').hide();
                        $(".js-profile").toggle("slow", function () {
                            // Animation complete.
                        });
                    }
                });
    });


    $(".js-profile-edit").click(function () {
        $('.js-profile-edit').hide();
        $('.js-profile-cancel,.js-profile-save').show();
        $(".js-profile").toggle("slow", function () {
            // Animation complete.
        });
    });

    $(".js-profile-cancel").click(function () {
        $('.js-profile-cancel,.js-profile-save').hide();
        $('.js-profile-edit').show();
        $(".js-profile").toggle("slow", function () {
            // Animation complete.
        });
    });
    // End Edit Investor profile ----------------------------

    // Edit Contact  ----------------------------------------
    $('.js-contact-save , #js-contact-save').on('click', function () {
        var param = $("#js-contact-form").serialize();
        var formURL = base_url + 'users/update_contact_mini';
        $.ajax({
                    url: formURL,
                    cache: false,
                    async: false,
                    type: "POST",
                    data: param,
                    dataType: "json",
                    success: function (data)
                    {
                        Notifier.success(data.msg);
                        $('#js-contact-phone').html(data.data.phone_number);
                        $('#js-contact-email').html(data.data.email);
                        $('#js-contact-twit').html(data.data.twitter);
                        $('#js-contact-fb').html(data.data.facebook);
                        $('#js-contact-ln').html(data.data.linkedin);
                        $('#js-contact-skype').html(data.data.skype);
                        $('#js-contact-edit').show();
                        $('#js-contact-cancel,.js-contact-save').hide();
                        $(".js-contact").toggle("slow", function () {
                            // Animation complete.
                        });

                    }
                });
    });

    $(document).on('click', '#js-contact-edit', function () {
        $(this).hide();
        $('#js-contact-cancel,.js-contact-save').show();
        $(".js-contact").toggle("slow", function () {
            // Animation complete.
        });
    });

    $(document).on('click', '#js-contact-cancel', function () {
        $('#js-contact-cancel,.js-contact-save').hide();
        $('#js-contact-edit').show();
        $(".js-contact").toggle("slow", function () {
            // Animation complete.
        });
    });

    // End Edit Contact  ----------------------------------------
};

$(document).ready(function () {

    $( "#form_company_name" ).autocomplete({
        source: function (request,response) {
            $.ajax(
            {
                url:base_url+'investor/get_companies' ,
                dataType: "json",
                type:'POST',
                data:{term: $.trim(request.term)},
                success: function (data)
                {
                    response(data);
                }
            });
        },
        select: function(event, ui) {
            newCompanySelected(ui.item);
        }
    });

    $(document).find('.js-experience #form_company_name').autocomplete({
        source: function (request,response) {
            $.ajax(
            {
                url:base_url+'investor/get_companies' ,
                dataType: "json",
                type:'POST',
                data:{term: $.trim(request.term)},
                success: function (data)
                {
                    response(data);
                }
            });
        },
        select: function(event, ui) {
            editCompanySelected(ui.item,this);
        }
    });

});

$(document).on('click', '#submit-report-js', function () {
    var investorid = $(this).data('investorid');
    var url = base_url + 'investor/report/' + investorid;
    $.ajax({
        type: 'post',
        url: url,
        data: $('#investor-report-form').serialize(),
        dataType: 'json',
        success: function (response) {
            if (response.status == 'success') {
                Notifier.success(response.msg);
            } else {
                Notifier.error(response.msg);
            }
        }
    });
});

$('.shortlist-add').on('click', function (e) {
    var slist = $(this);
    $.ajax({
        dataType: 'JSON',
        url: base_url + 'entrepreneur/addshortlist/' + $(this).attr('data-value'),
        success: function (data) {
            if (data.status == 'success') {
                //location.reload();
                $(slist).addClass('shortlist-delete').addClass('btn-shortlisted');
                $(slist).removeClass('shortlist-add');
                show_message(data.msg);
                hide_message(data.msg);
                delay(300);
            }
        }
    });
});

$('.shortlist-delete').on('click', function (e) {
    var slist = $(this);
    $.ajax({
        dataType: 'JSON',
        url: base_url + 'entrepreneur/deleteshortlist/' + $(this).attr('data-value'),
        success: function (data) {
            if (data.status == 'success') {
                //location.reload();
                $(slist).addClass('shortlist-add');
                $(slist).removeClass('shortlist-delete').removeClass('btn-shortlisted');

                show_message(data.msg);
                hide_message(data.msg);
                delay(300);
            }
        }
    });
});

$('.js-check-continent').find(':checkbox').change(function () {
    if ($(this).prop('checked')) {
        $(this).closest('.js-network').find('.js-network-toggle ul').find(':checkbox').each(function () {
            if (!$(this).prop('checked')) {
                $(this).click();
            }
        })
    } else {
        $(this).closest('.js-network').find('.js-network-toggle ul').find(':checkbox').each(function () {
            if ($(this).prop('checked')) {
                $(this).click();
            }
        })
    }
});

$('.drop-select').click(function () {
    var par = $(this).closest('.row'),
            parUl = par.find('ul'),
            liHeight = parUl.find('li').outerHeight();
    if ($(this).hasClass('up')) {
        parUl.css('height', 'auto').hide().slideDown(500);
        $(this).removeClass('up').find('i').removeClass('fa-caret-down').addClass('fa-caret-up');
    } else {
        parUl.animate({height: liHeight}, {queue: false, duration: 500});
        $(this).addClass('up').find('i').removeClass('fa-caret-up').addClass('fa-caret-down');
    }
});

$('.js-network-dropdown').click(function (e) {
    e.preventDefault();
    var parUl = $(this).closest('.row');
    var liHeight = $('.js-check-continent').outerHeight();
    if ($(this).hasClass('up')) {
        parUl.css('height', 'auto').hide().slideDown(500).removeClass('half-height');
        $(this).removeClass('up').find('i').removeClass('fa-caret-down').addClass('fa-caret-up');
    } else {
        parUl.animate({height: liHeight}, {queue: false, duration: 500}).addClass('half-height');
        $(this).addClass('up').find('i').removeClass('fa-caret-up').addClass('fa-caret-down');
    }
});

var checkedArray = [];
$('.sites-checkboxes').find(':checkbox').change(function () {

    if ($(this).prop('checked')) {
        checkedArray.push(1);
    } else {
        checkedArray.pop();
    }
});

var checkedArray1 = [];
$('.locations-checkboxes').find(':checkbox').change(function () {

    if ($(this).prop('checked')) {
        checkedArray1.push(1);
    } else {
        checkedArray1.pop();
    }
});

var SUCCESS_TEXT='<?= $ph("global:success"); ?>';
$(document).on('click','.already-endorsed-js',function (e) {
    e.preventDefault();
    Notifier.success('<?= $ph("global:already_endorsed"); ?>');
});

$(document).on('change','.new-company-logo-js,.company-logo-js', function () {
    readURL(this);
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(input).siblings('.logo-preview-js').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function newCompanySelected(item){
    if(item.logo){
    $("#js-add-experience-autocomplete .logo-preview-js").attr('src',item.logo);
    }
    $("#js-add-experience-autocomplete .autocomplete-company-name-js").text(item.name);
    $("#js-add-experience-autocomplete .autocomplete-company-text-js").text(item.description);
    $("#js-add-experience-autocomplete .autocomplete-company-website-js").text(item.website);
    $("#js-add-experience").siblings('.js-experience-save').hide();
    $("#js-add-experience").siblings('.js-autocomplete-save').attr('data-companyid',item.id).show();
    $("#js-add-experience").hide();
    $("#js-add-experience-autocomplete").show();
    Notifier.success('');
}

function editCompanySelected(item,element){
    element=$(element).parents('.js-experience');
    element.find("#form_company_name").val(item.name);
    element.find("#form_company_description").val(item.description);
    element.find("#form_company_website").val(item.website);
    element.find(".logo-preview-js").attr('src',item.logo);
    element.find(".company-logo-label-js").hide();
    element.find('.save-experience-added-js').hide();
    element.find('.save-experience-autocomplete-js').attr('data-companyid',item.id).show();
    Notifier.success('');
}

function resetForm(){
    $('#js-add-experience').show();
    $('#js-company-selected').hide();
    $(document).find('.company-wrapper').html('');
    $(document).find('.cmimg_js').html('<span>' + labels.logo + '</span>');
    $(document).find('.cmname_js').val('');
    $(document).find('.cmrole_js').val('');
    $(document).find('.cmtext_js').val('');
    $(document).find('.cmid_js').val('');
}

$(document).on('keyup','.js-fetch-companies',function (e) {
    var input = $(this).val();
    $.ajax({
            url:base_url+'investor/get_companies_grid' ,
            dataType: "json",
            type:'POST',
            data:{term: input},
            success: function (response){
                $('.company-wrapper').html(response.companies_grid);
            }
        });
});

$(document).on('click','.js-select-company',function (e) {
    var id = $(this).data('id');
    $.ajax({
        url: base_url + 'investor/get_company_info',
        dataType: "json",
        type: 'POST',
        data: {id: id},
        success: function (response) {
            $('#js-add-experience').show();
            $("div").remove( ".company-wrapper" );
            $(document).find('.cmname_js').val(response.name);
            $(document).find('.cmtext_js').val(response.description);
            $(document).find('.cmimg_js').html(response.logo);
            $(document).find('.cmid_js').val(id);
        }
    });
});

$(document).on('click','.js-update_inv_company', function (e) {
    var company_id = $('#js-company-id').val();
    var rold_id = $('#form_role_id').val();
    var investor_id = $('.js-user-id').val();
    $.ajax({
        url:base_url+'investor/update_investor_company' ,
        dataType: "json",
        type:'POST',
        data:{id: company_id, investor_id: investor_id, rold_id: rold_id},
        success: function (response){
            if(response.status == 'success'){
                var innerdiv = $(document).find('#expc-' + response.id).length;
                if (innerdiv > 0) {
                    $(document).find('#expc-' + response.id).html(response.company);
                } else {
                    $('<div id="expc-' + response.id + '">' + response.company + '</div>').prependTo('.expc_js');
                }
                Notifier.success(response.msg);

            }
            else{
                Notifier.error(response.msg);
            }
        }
    });
    $('.js-company-modal').modal('hide');
});

$('.js-company-modal').on('hidden.bs.modal', function () {
    resetForm();
});
