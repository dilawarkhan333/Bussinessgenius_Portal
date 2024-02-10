$(document).ready(function () {
    var contentLoadTriggered = false;
    var loadStages = true;
    $(window).scroll(function () {
        var base_url = Beard.root;
        var blockPosition = $('.load-more-block').offset().top;
        var blockPositionOuterHt = $('.load-more-block').outerHeight();

        var current_sector_id = $('#js-current_sector').val();
        var current_displayed_sector = $('#js-displayed_sector').val();

        var current_stage_id = $('#js-current_stage').val();
        var current_displayed_stage = $('#js-displayed_stage').val();

        if (($(document).scrollTop() > (blockPosition + (blockPositionOuterHt - blockPositionOuterHt / 3) - $(window).height())) && contentLoadTriggered == false) {
            contentLoadTriggered = true;
            $('#explore-loader').show();

            if (loadStages == true) {
                $.ajax({
                    url: base_url + 'explore/load_more_stages',
                    type: 'POST',
                    data: { current_stage: current_stage_id, displayed_stages: current_displayed_stage },
                    dataType: 'json',
                    success: function (response) {
                        $.each(response.proposals_details, function (key, item) {
                            if (item.status == 'success') {
                                $('#stage-block').append(item.proposals);
                                $('#js-current_stage').val(response.sector_ids);
                                $('#js-displayed_stage').val(response.displayed_list);
                                $('#explore-loader').hide();
                                $(document).find(".more_industries").owlCarousel({
                                    items: 3,
                                    autoplay: false,
                                    nav: true,
                                    navText: ['<span class="btn btn-default"><i class="fa fa-angle-left"></i> </span>', '<span class="btn btn-default"><i class="fa fa-angle-right"></i></span>'],
                                    dots: false,
                                    lazyLoad: true,
                                    lazyContent: true,
                                    responsive: {
                                        0: { items: 1 },
                                        1500: { items: 3 },
                                        1200: { items: 3 },
                                        990: { items: 3 },
                                        767: { items: 2 },
                                        551: { items: 2 },
                                        320: { items: 1 }
                                    },
                                });
                            }
                            else if (item.status == 'empty') {
                                $('#explore-loader').remove();
                            }
                            else {
                                //$('#explore-loader').html(response.msg);
                                loadStages = false;
                            }
                            contentLoadTriggered = false;
                        });
                    }
                });
            } else if (loadStages == false) {
                $.ajax({
                    url: base_url + 'explore/load_more_industries',
                    type: 'POST',
                    data: { current_sector: current_sector_id, displayed_sector: current_displayed_sector },
                    dataType: 'json',
                    success: function (response) {
                        $.each(response.proposals_details, function (key, item) {
                            if (item.status == 'success') {
                                $('#industry-block').append(item.proposals);
                                $('#js-current_sector').val(response.sector_ids);
                                $('#js-displayed_sector').val(response.displayed_list);
                                $('#explore-loader').hide();

                                $(document).find(".more_industries").owlCarousel({
                                    items: 3,
                                    autoplay: false,
                                    nav: true,
                                    navText: ['<span class="btn btn-default"><i class="fa fa-angle-left"></i> </span>', '<span class="btn btn-default"><i class="fa fa-angle-right"></i></span>'],
                                    dots: false,
                                    lazyLoad: true,
                                    lazyContent: true,
                                    responsive: {
                                        0: { items: 1 },
                                        1500: { items: 3 },
                                        1200: { items: 3 },
                                        990: { items: 3 },
                                        767: { items: 2 },
                                        551: { items: 2 },
                                        320: { items: 1 }
                                    },
                                });
                            }
                            else if (item.status == 'empty') {
                                $('#js-current_sector').val(response.sector_ids);
                                $('#js-displayed_sector').val(response.displayed_list);
                            }
                            else {
                                $('#explore-loader').remove();
                                loadStages = null;
                            }
                            contentLoadTriggered = false;
                        });
                    }
                })
            }
        }
    });

    // INDUSTRY PICKS SECTION
    $(document).on('click', '.js-show', function (e) {
        var list = $('.r-line > .active').data('id');
        var id = $(this).data('id');
        $('.js-block-trigger').hide();
        $("#industry_" + id).show();
        $('#list_' + list).removeClass('active');
        $(this).addClass('active');
    });


});

$(document).find("#spotlight").owlCarousel({
    items: 1,
    autoplay: false,
    nav: true,
    navText: ['<span class="btn btn-default"><i class="fa fa-angle-left"></i> </span>', '<span class="btn btn-default"><i class="fa fa-angle-right"></i></span>'],
    dots: false,
    lazyLoad: true,
    lazyContent: true,
    responsive: {
        0: { items: 1 },
        1500: { items: 1 },
        1200: { items: 1 },
        990: { items: 1 },
        767: { items: 1 },
        551: { items: 1 },
        320: { items: 1 }
    },
});

$(document).find(".owl-carousel").owlCarousel({
    items: 3,
    autoplay: false,
    nav: true,
    navText: ['<span class="btn btn-default"><i class="fa fa-angle-left"></i> </span>', '<span class="btn btn-default"><i class="fa fa-angle-right"></i></span>'],
    dots: false,
    lazyLoad: true,
    lazyContent: true,
    responsive: {
        0: { items: 1 },
        1500: { items: 3 },
        1200: { items: 3 },
        990: { items: 3 },
        767: { items: 2 },
        551: { items: 2 },
        320: { items: 1 }
    },
});