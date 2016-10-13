const CHAMPION_LIST = ['Androxus', 'Barik', 'Bomb King', 'Buck', 'Cassie', 'Drogoz', 'Evie', 'Fernando', 'Grohk', 'Grover', 'Kinessa', 'Makoa', 'Pip', 'Ruckus', 'Skye', 'Viktor', 'Ying'];
var activeChampion = randomizeChampion();

function randomizeChampion() {
    return CHAMPION_LIST[Math.floor(Math.random()*CHAMPION_LIST.length)];
}

//On DOM load
$(function() {
    $('.pc-rightbar').mCustomScrollbar({
        axis: 'y',
        scrollbarPosition: 'inside',
        theme: 'minimal'
    });

    $('.champion-icon').attr('src', './img/champicons/'+activeChampion+'.png');
    $('.champion-icon').attr('alt', activeChampion);
});

//On full page load
$(window).on('load', function() {
    $('.loadingOverlay').fadeOut(500, function() {
        //On fade out complete
        $(this).remove();
    });
});
