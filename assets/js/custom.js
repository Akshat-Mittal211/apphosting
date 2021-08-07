// upload image js
function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function (e) {
            $('.image-upload-wrap').hide();

            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();

            $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);

    } else {
        removeUpload();
    }
}

function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});

// end


// Edit recipe image upload js






//I added event handler for the file upload control to access the files properties.
document.addEventListener("DOMContentLoaded", init, false);

//To save an array of attachments
var AttachmentArray = [];

//counter for attachment array
var arrCounter = 0;

//to make sure the error message for number of files will be shown only one time.
var filesCounterAlertStatus = false;

//un ordered list to keep attachments thumbnails
var ul = document.createElement("ul");
ul.className = "thumb-Images";
ul.id = "imgList";

function init() {
    //add javascript handlers for the file upload event
    document
        .querySelector("#files")
        .addEventListener("change", handleFileSelect, false);
}

//the handler for file upload event
function handleFileSelect(e) {
    //to make sure the user select file/files
    if (!e.target.files) return;

    //To obtaine a File reference
    var files = e.target.files;

    // Loop through the FileList and then to render image files as thumbnails.
    for (var i = 0, f; (f = files[i]); i++) {
        //instantiate a FileReader object to read its contents into memory
        var fileReader = new FileReader();

        // Closure to capture the file information and apply validation.
        fileReader.onload = (function (readerEvt) {
            return function (e) {
                //Apply the validation rules for attachments upload
                ApplyFileValidationRules(readerEvt);

                //Render attachments thumbnails.
                RenderThumbnail(e, readerEvt);

                //Fill the array of attachment
                FillAttachmentArray(e, readerEvt);
            };
        })(f);

        // Read in the image file as a data URL.
        // readAsDataURL: The result property will contain the file/blob's data encoded as a data URL.
        // More info about Data URI scheme https://en.wikipedia.org/wiki/Data_URI_scheme
        fileReader.readAsDataURL(f);
    }
    document
        .getElementById("files")
        .addEventListener("change", handleFileSelect, false);
}

//To remove attachment once user click on x button
jQuery(function ($) {
    $("div").on("click", ".img-wrap .close", function () {
        var id = $(this)
            .closest(".img-wrap")
            .find("img")
            .data("id");

        //to remove the deleted item from array
        var elementPos = AttachmentArray.map(function (x) {
            return x.FileName;
        }).indexOf(id);
        if (elementPos !== -1) {
            AttachmentArray.splice(elementPos, 1);
        }

        //to remove image tag
        $(this)
            .parent()
            .find("img")
            .not()
            .remove();

        //to remove div tag that contain the image
        $(this)
            .parent()
            .find("div")
            .not()
            .remove();

        //to remove div tag that contain caption name
        $(this)
            .parent()
            .parent()
            .find("div")
            .not()
            .remove();

        //to remove li tag
        var lis = document.querySelectorAll("#imgList li");
        for (var i = 0; (li = lis[i]); i++) {
            if (li.innerHTML == "") {
                li.parentNode.removeChild(li);
            }
        }
    });
});

//Apply the validation rules for attachments upload
function ApplyFileValidationRules(readerEvt) {
    //To check file type according to upload conditions
    if (CheckFileType(readerEvt.type) == false) {
        alert(
            "The file (" +
            readerEvt.name +
            ") does not match the upload conditions, You can only upload jpg/png/gif files"
        );
        e.preventDefault();
        return;
    }

    //To check file Size according to upload conditions
    if (CheckFileSize(readerEvt.size) == false) {
        alert(
            "The file (" +
            readerEvt.name +
            ") does not match the upload conditions, The maximum file size for uploads should not exceed 300 KB"
        );
        e.preventDefault();
        return;
    }

    //To check files count according to upload conditions
    if (CheckFilesCount(AttachmentArray) == false) {
        if (!filesCounterAlertStatus) {
            filesCounterAlertStatus = true;
            alert(
                "You have added more than 10 files. According to upload conditions you can upload 10 files maximum"
            );
        }
        e.preventDefault();
        return;
    }
}

//To check file type according to upload conditions
function CheckFileType(fileType) {
    if (fileType == "image/jpeg") {
        return true;
    } else if (fileType == "image/png") {
        return true;
    } else if (fileType == "image/gif") {
        return true;
    } else {
        return false;
    }
    return true;
}

//To check file Size according to upload conditions
function CheckFileSize(fileSize) {
    if (fileSize < 300000) {
        return true;
    } else {
        return false;
    }
    return true;
}

//To check files count according to upload conditions
function CheckFilesCount(AttachmentArray) {
    //Since AttachmentArray.length return the next available index in the array,
    //I have used the loop to get the real length
    var len = 0;
    for (var i = 0; i < AttachmentArray.length; i++) {
        if (AttachmentArray[i] !== undefined) {
            len++;
        }
    }
    //To check the length does not exceed 10 files maximum
    if (len > 9) {
        return false;
    } else {
        return true;
    }
}

//Render attachments thumbnails.
function RenderThumbnail(e, readerEvt) {
    var li = document.createElement("li");
    ul.appendChild(li);
    li.innerHTML = [
        '<div class="img-wrap"> <span class="close">&times;</span>' +
        '<img class="thumb" src="',
        e.target.result,
        '" title="',
        escape(readerEvt.name),
        '" data-id="',
        readerEvt.name,
        '"/>' + "</div>"
    ].join("");

    var div = document.createElement("div");
    div.className = "FileNameCaptionStyle";
    li.appendChild(div);
    div.innerHTML = [readerEvt.name].join("");
    document.getElementById("Filelist").insertBefore(ul, null);
}

//Fill the array of attachment
function FillAttachmentArray(e, readerEvt) {
    AttachmentArray[arrCounter] = {
        AttachmentType: 1,
        ObjectType: 1,
        FileName: readerEvt.name,
        FileDescription: "Attachment",
        NoteText: "",
        MimeType: readerEvt.type,
        Content: e.target.result.split("base64,")[1],
        FileSizeInBytes: readerEvt.size
    };
    arrCounter = arrCounter + 1;
}
//  























// js for share more button

$('.more-share-btn').click(function () {

    $('.moreshare-link').toggleClass('d-block');

    $('.show-more-sociallink').toggleClass('hide');


});

// end



// compare slider js

$(".compare-slider").owlCarousel({
    items: 7,
    loop: true,
    nav: true,
    dots: false,
    autoplayTimeout: 7000,
    smartSpeed: 800,
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 6,
        },
        1600: {
            items: 7,

        }
    }
});

// recipe-product-slider js


$(".recipe-product-slider").owlCarousel({

    items: 1,
    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    animateOut: 'fadeOut'


});


// formulate compare slider js

$("#formulate-compare-slider").owlCarousel({
    items: 3,
    loop: true,
    nav: true,
    dots: false,
    touchDrag: false,
    mouseDrag: false,
    autoplayTimeout: 7000,
    smartSpeed: 800,
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 2,
        },
        1600: {
            items: 3,

        }
    }
});


// recipe slider js

$(".recipe-slider").owlCarousel({


    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    autoplayTimeout: 7000,
    smartSpeed: 800,

    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 3,
        },
        1600: {
            items: 4,

        }
    }
});

$(".recipe-slider").owlCarousel({

    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    autoplayTimeout: 7000,
    smartSpeed: 800,

    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 3,
        },
        1600: {
            items: 4,

        }
    }
});




$(document).ready(function () {
    var minVal = 1, maxVal = 20; // Set Max and Min values
    // Increase product quantity on cart page
    $(".increaseQty").on('click', function () {
        var $parentElm = $(this).parents(".qtySelector");
        $(this).addClass("clicked");
        setTimeout(function () {
            $(".clicked").removeClass("clicked");
        }, 100);
        var value = $parentElm.find(".qtyValue").val();
        if (value < maxVal) {
            value++;
        }
        $parentElm.find(".qtyValue").val(value);
    });
    // Decrease product quantity on cart page
    $(".decreaseQty").on('click', function () {
        var $parentElm = $(this).parents(".qtySelector");
        $(this).addClass("clicked");
        setTimeout(function () {
            $(".clicked").removeClass("clicked");
        }, 100);
        var value = $parentElm.find(".qtyValue").val();
        if (value > 1) {
            value--;
        }
        $parentElm.find(".qtyValue").val(value);
    });

    // Read more js

    $("#readmore").click(function () {
        var elem = $("#readmore").text();
        if (elem == "Read More") {
            //Stuff to do when btn is in the read more state
            $("#readmore").text("Read Less");
            $(".read-more").slideDown();
        } else {
            //Stuff to do when btn is in the read less state
            $("#readmore").text("Read More");
            $(".read-more").slideUp();
        }
    });


    $('.ingredients-type-wrp .tab-menu li a').on('click', function () {
        var target = $(this).attr('data-rel');
        $('.ingredients-type-wrp .tab-menu li a').removeClass('active');
        $(this).addClass('active');
        $("#" + target).fadeIn('slow').siblings(".ingredients-type-wrp .tab-box").hide();
        return false;
    });

    $('.tags-tab-main .tab-menu li a').on('click', function () {
        var target = $(this).attr('data-rel');
        $('.tags-tab-main .tab-menu li a').removeClass('active');
        $(this).addClass('active');
        $("#" + target).fadeIn('slow').siblings(".tags-tab-main .tab-box").hide();
        return false;
    });

    $('.bookmark-btn, .filter-btn-dash').click(function () {
        setTimeout("$('#favorite-modal').modal('hide');", 3000);

    });

    $(".filter-sidebar-btn").click(function () {
        $("body").toggleClass("OpenFilerSideBar");
    });

    $(".ranking-btn").click(function () {
        $(".ranking-btn").toggleClass("active");
    });

    var selectedScheme = 'allOption';

    $('.custom-selectbx.filter-all select').change(function () {
        $('.search-style').removeClass(selectedScheme).addClass($(this).val());
        selectedScheme = $(this).val();
    });




    $('.toggle-side-menu').click(function () {
        $('body').toggleClass('open-collection-sidebar');
    });
    $('.comment-btn').click(function () {
        $('.comment-notes-section').addClass("open-sidebar")
    });

    $('.close-sidebar').click(function () {
        $('.comment-notes-section').removeClass("open-sidebar")
    });

});

$(window).scroll(function () {
    var ww = $('.tes').offset().top;
    var ftr = $('#footer').offset().top;
    if ($(this).scrollTop() >= ww - 900 && $(this).scrollTop() <= ftr - 150) {
        $('.sidewrp-container').addClass('active');
    } else {
        $('.sidewrp-container').removeClass('active');
    }
});

const preloader = document.querySelector('.preloader');

const fadeEffect = setInterval(() => {
    // if we don't set opacity 1 in CSS, then   //it will be equaled to "", that's why we   // check it
    if (!preloader.style.opacity) {
        preloader.style.opacity = 1;


    }
    if (preloader.style.opacity > 0) {
        preloader.style.opacity -= 0.1;
        document.querySelector('.preloader').style.zIndex = "9999";
        document.querySelector('.site-header').style.zIndex = "99";
    } else {
        clearInterval(fadeEffect);
        document.querySelector('.preloader').style.zIndex = "-99";
        document.querySelector('.site-header').style.zIndex = "9999";
    }
}, 200);

window.addEventListener('load', fadeEffect);