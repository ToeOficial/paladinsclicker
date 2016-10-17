//     ***** INIT *****

//Champion list
//UPDATE WHEN NEW CHAMPION COMES OUT
const CHAMPION_LIST = ['Androxus', 'Barik', 'Bomb King', 'Buck', 'Cassie', 'Drogoz', 'Evie', 'Fernando', 'Grohk', 'Grover', 'Kinessa', 'Makoa', 'Mal\'Damba', 'Pip', 'Ruckus', 'Skye', 'Viktor', 'Ying'];
var activeChampion = '';

var championHP = 10;
var maxChampionHP = 10;

var dmg = 1;
var dps = 0;

var gold = 0;
var goldPerKill = 3;
var topUnlocked = 0;

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
            }, 200);
        });
        oldXp=xp;
        xp+=xpPerKill;
        updateXp();
        championHP = maxChampionHP;
        gold+=goldPerKill;
        $('#goldSpan').html(gold);
    }
}

function updateXp() {
    //Too much xp, lvl up
    while(xp>maxXp) {
        level++;
        oldXp=0;
        xp=(xp-maxXp);
        maxXp=Math.floor(1.3*maxXp);
        maxChampionHP+=5;
        xpPerKill=Math.floor(1.05*xpPerKill);
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

//     ***** ITEMS *****
//"Class" handling items
function Item(id, name, type, bonus, cost, req, unl) {
    this.id = id; //Unique short string without any spaces
    this.name = name; //Full name displayed on GUI
    this.type = type; //Item type:
    //1: DMG
    //2: DPS
    //3: GOLDPERKILL
    this.bonus = bonus; //Stat amount you get from item
    this.cost = cost; //Item cost
    this.level = 0; //Starting level (by default 0, because we don't have it unlocked)
    this.image = './img/items/' + id + '.png'; //Image stored in ./img/items/ with .png extension
    this.costid = '#cost-' + id; //Id of element containing item price
    this.levelid = '#level-' + id; //Id of element containing item level
    this.buyid = '#buy-' + id; //Id of buy button
    this.req = req; //Required item (most of the time 1 less)
    this.unl = unl; //Item number (starts at 1)

    this.buy = function() {
        if (this.cost <= gold) {
            gold -= this.cost;
            gold = Math.floor(gold);
            $('#goldSpan').html(gold);
            this.level += 1;
            this.cost = Math.floor(this.cost * 1.5);
            if (this.type == 1) {
                dmg += this.bonus;
                $('#damageSpan').html(dmg);
            } else if (this.type == 2) {
                dps += this.bonus;
                $('#dpsSpan').html(dps);
            } else if (this.type == 3) {
                goldPerKill += this.bonus;
                $('#gpkSpan').html(goldPerKill);
            }
            if(this.unl > topUnlocked) {
                topUnlocked = this.unl;
            }
            //play sound
            return true;
        }
        return false;
    }

    this.render = function() {
        $(this.costid).html(this.cost);
        $(this.levelid).html(this.level);
        if (this.cost > gold) {
            $(this.buyid).addClass('dis');
        } else {
            $(this.buyid).removeClass('dis');
        }
    }

    Item.instances.push(this);
}

//Instances:
Item.instances = [];

var basicbow = new Item('basicbow', 'Cassie\'s Bow', 1, 1, 20, 0, 1);


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


    //     ***** DPS AND GPS TIMER *****
    var dpstimer = setInterval(function() {
        championHP-=dps;
        $('#goldSpan').html(gold);
        updateHP();
    }, 1000);


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
