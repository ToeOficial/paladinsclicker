//     ***** INIT *****

//Champion list
//UPDATE WHEN NEW CHAMPION COMES OUT
const CHAMPION_LIST = ['Androxus', 'Barik', 'Bomb King', 'Buck', 'Cassie', 'Drogoz', 'Evie', 'Fernando', 'Grohk', 'Grover', 'Kinessa', 'Makoa', 'Pip', 'Ruckus', 'Skye', 'Viktor', 'Ying'];
var activeChampion = '';

var championHP = 10;
var maxChampionHP = 10;
var dmg = 1;

var level = 1;
var oldXp = 0;
var xp = 0;
var xpPerKill = 20;
var maxXp = 100;
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
        championHP = maxChampionHP;
        oldXp=xp;
        xp+=xpPerKill;
        updateXp();
    }
}

function updateXp() {
    if(xp>maxXp) {
        level++;
        oldXp=0;
        xp=(xp-maxXp);
        maxXp=Math.floor(1.2*maxXp);
        $('.level-text').html(level);
    }
    drawLvLCircle();
}

//Draw lvl
function drawLvLCircle() {
    var canvas = document.getElementById('lvlCanvas'),
        ctx = canvas.getContext('2d'),
        centerX = canvas.width / 2,
        centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, 114, 0 * Math.PI, 2 * Math.PI, false);
    ctx.lineWidth = 28;
    ctx.strokeStyle = '#128D8A';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 114, 0 * Math.PI, 2 * Math.PI, false);
    ctx.lineWidth = 24;
    ctx.strokeStyle = '#222222';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 114, 3.5 * Math.PI, (3.5+(2*(xp/maxXp)))*Math.PI, false);
    ctx.strokeStyle = '#54E9E6';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 114, 3.5 * Math.PI, (3.5+(2*(oldXp/maxXp)))*Math.PI, false);
    ctx.strokeStyle = '#128D8A';
    ctx.stroke();
}

//Function running on each click
function click() {
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

    drawLvLCircle();
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
