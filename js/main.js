const CHAMPION_LIST = ['Androxus', 'Barik', 'Bomb King', 'Buck', 'Cassie', 'Drogoz', 'Evie', 'Fernando', 'Grohk', 'Grover', 'Kinessa', 'Makoa', 'Pip', 'Ruckus', 'Skye', 'Viktor', 'Ying'];


function randomizeChampion() {
    return CHAMPION_LIST[Math.floor(Math.random()*CHAMPION_LIST.length())];
}

//On DOM load
$(function() {
    $('.pc-rightbar').mCustomScrollbar({
        axis: 'y',
        scrollbarPosition: 'inside',
        theme: 'minimal'
    });
    
});

//On full page load
$(window).on('load', function() {
    $('.loadingOverlay').fadeOut(500);
});
