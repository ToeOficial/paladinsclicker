//     ***** INIT *****

//Champion list
//UPDATE WHEN NEW CHAMPION COMES OUT
const CHAMPION_LIST = ['Androxus', 'Barik', 'Bomb King', 'Buck', 'Cassie', 'Drogoz', 'Evie', 'Fernando', 'Grohk', 'Grover', 'Kinessa', 'Makoa', 'Pip', 'Ruckus', 'Skye', 'Viktor', 'Ying'];
var activeChampion = '';

var championHP = 10;
var maxChampionHP = 10;
var dmg = 1;

//Get random champion from the list
function randomizeChampion() {
    activeChampion = CHAMPION_LIST[Math.floor(Math.random()*CHAMPION_LIST.length)];

    $('.champion-icon').attr('src', './img/champicons/'+activeChampion+'.png');
    $('.champion-icon').attr('alt', activeChampion);
    $('.champion-name').html(activeChampion);
}

function updateHP() {
    $('.health-progress').animate({
        width: (274-((championHP/maxChampionHP)*274))
    }, 100);
    if (championHP<=0) {
        $('.champion-icon').effect('explode', {pieces: 32}, 500, function() {
            randomizeChampion();
            $(this).show();

            $('.health-progress').animate({
                width: (274-((championHP/maxChampionHP)*274))
            }, 100);
        });
        //randomizeChampion();
        championHP = maxChampionHP;
    }
}
//Function running on each click
function click() {
    console.log('Click!');
    championHP-=dmg;
    updateHP();
}

//On full page load
$(window).on('load', function() {
    $('.loadingOverlay').delay(500).fadeOut(500, function() {
        //On fade out complete
        $(this).remove();
    });
});

//On DOM load
$(function() {
    $('.tooltip').tooltipster();
    $('.pc-rightbar').mCustomScrollbar({
        axis: 'y',
        scrollbarPosition: 'inside',
        theme: 'minimal'
    });

    randomizeChampion();

    //     ***** EVENTS *****
    //On champion icon left or middle click
    $('.champion-icon').click(function() {
        click();
    });

    //On champion wrapper right click
    $('.champion-wrapper').contextmenu(function() {
        return false;
    });

    //On champion icon right click
    $('.champion-icon').contextmenu(function() {
        click();
        return false;
    });
});
