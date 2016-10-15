//     ***** INIT *****

//Champion list
//UPDATE WHEN NEW CHAMPION COMES OUT
const CHAMPION_LIST = ['Androxus', 'Barik', 'Bomb King', 'Buck', 'Cassie', 'Drogoz', 'Evie', 'Fernando', 'Grohk', 'Grover', 'Kinessa', 'Makoa', 'Mal\'Damba', 'Pip', 'Ruckus', 'Skye', 'Viktor', 'Ying'];
var activeChampion = '';

var championHP = 10;
var maxChampionHP = 10;
var dmg = 1;

var level = 1;
var oldXp = 0;
var xp = 0;
var xpPerKill = 20;
var maxXp = 100;

//Settings
var explodePieces = 32;
//Get random champion from the list
function randomizeChampion() {
    activeChampion = CHAMPION_LIST[Math.floor(Math.random()*CHAMPION_LIST.length)];

    $('.champion-icon').attr('src', './img/champicons/'+activeChampion+'.png');
    $('.champion-icon').attr('alt', activeChampion);
    $('.champion-name').html(activeChampion);
}

function updateHP() {
    $('.health-progress').stop(true).animate({
        width: (274-((championHP/maxChampionHP)*274))
    }, 100);
    $('.health-wrapper').tooltipster('content', championHP+'/'+maxChampionHP);

    if (championHP<=0) {
        $('.champion-icon').effect('explode', {pieces: explodePieces}, 500, function() {
            randomizeChampion();
            $(this).show();

            $('.health-wrapper').tooltipster('content', championHP+'/'+maxChampionHP);
            $('.health-progress').stop(true).animate({
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
    //Display effect only if we don't rank up
    if(!(xp>maxXp)) {
        $('.level-text').effect('highlight', { color: '#54E9E6'}, 250);
    }

    //Too much xp, lvl up
    while(xp>maxXp) {
        level++;
        oldXp=0;
        xp=(xp-maxXp);
        maxXp=Math.floor(1.2*maxXp);
        $('.level-text').effect('highlight', { color: '#54E9E6'}, 1500);
        $('.level-text').html(level);
    }
    $('.level-text').tooltipster('content', xp+'/'+maxXp);
    drawLvLCircle();
}

//Draw lvl
function drawLvLCircle() {
    var canvas = document.getElementById('lvlCanvas'),
        ctx = canvas.getContext('2d'),
        centerX = canvas.width / 2,
        centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Bigger circle - border
    ctx.beginPath();
    ctx.arc(centerX, centerY, 114, 0, 2 * Math.PI, false);
    ctx.lineWidth = 28;
    ctx.strokeStyle = '#128D8A';
    ctx.stroke();

    //Grey circle - empty space
    ctx.beginPath();
    ctx.arc(centerX, centerY, 114, 0, 2 * Math.PI, false);
    ctx.lineWidth = 24;
    ctx.strokeStyle = '#222222';
    ctx.stroke();

    //New xp
    ctx.beginPath();
    ctx.arc(centerX, centerY, 114, 3.5 * Math.PI, (3.5+(2*(xp/maxXp)))*Math.PI, false);
    ctx.strokeStyle = '#54E9E6';
    ctx.stroke();

    //Old xp
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
    //Init tooltipster
    $('.tooltipster').tooltipster({
        theme: ['tooltipster-punk', 'tooltipster-punk-customized'], //use custom theme
        animation: 'slide',
        delay: [300, 1500],
        animationDuration: [300, 1500],
        updateAnimation: 'scale'
    });
    //Init custom scrollbar
    $('.pc-rightbar').mCustomScrollbar({
        axis: 'y',
        scrollbarPosition: 'inside',
        theme: 'minimal'
    });

    //Draw level indicator and pick random champion
    drawLvLCircle();
    randomizeChampion();

    //decrease lag on smaller devices
    //default of 32 pieces on 1280 screen width
    //scales with width, so it's 4 pieces on mobile
    //caps at 128
    explodePieces = Math.pow(2, ($(window).width()/1280)*5);
    if(explodePieces>128) {
        explodePieces = 128;
    }

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
