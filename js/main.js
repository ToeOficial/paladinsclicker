//On DOM load
$(function() {
    $('.pc-rightbar').mCustomScrollbar({
        axis: 'y',
        scrollbarPosition: 'inside',
        theme: 'minimal'
    });
});

//On full page load
$(window).on("load", function() {
    $('.loadingOverlay').fadeOut(500);
});
