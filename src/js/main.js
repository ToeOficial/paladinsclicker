/*
Paladins​™ and Paladins™: Champions of the Realm​​™ are trademarks of Hi­Rez Studios, Inc. in the United States and other countries.
*/

//     ***** INIT *****
//Champion list
//UPDATE WHEN NEW CHAMPION COMES OUT
const CHAMPION_LIST = ['Androxus', 'Barik', 'Bomb King', 'Buck', 'Cassie', 'Drogoz', 'Evie', 'Fernando', 'Grohk', 'Grover', 'Kinessa', 'Makoa',
                       'Mal\'Damba', 'Pip', 'Ruckus', 'Skye', 'Sha Lin', 'Viktor', 'Ying'];
var activeChampion = '';

//Current and max hp of the champion
var championHP = 10;
var maxChampionHP = 10;

//Dmg per click and dmg per second
var dmg = 1;
var dps = 0;

var gold = 0;
var goldPerKill = 3;
var topUnlocked = 0; //Top unlocked item

var level = 1;
var oldXp = 0; //Xp that was already there before champion kill
var xp = 0; //Both old and new xp
var xpPerKill = 20;
var maxXp = 100;

//Balance
const championHPperLevel = 3;
const maxXpPerLevelMulti = 1.3;
const xpPerKillPerLevelMulti = 1.05;
const multipleOfGPKupgrade = 5;
const costPerBuyMulti = 1.4;

//Settings
var explodePieces = 32;
var easterEggs = false;

//Get random champion from the list
function randomizeChampion() {
    activeChampion = CHAMPION_LIST[Math.floor(Math.random()*CHAMPION_LIST.length)]; //Pick random champion

    //Update champion info in GUI
    $('.champion-icon').attr('src', './img/champicons/'+activeChampion+'.png');
    $('.champion-icon').attr('alt', activeChampion);
    $('.champion-name').html(activeChampion);
}

//     ***** UPDATERS *****
function updateHP() {
    var nextWidth = 274-((championHP/maxChampionHP)*274);
    if (nextWidth>274) {
        nextWidth = 274; //Can't go over max hp
    }

    $('.health-progress').animate({
        width: nextWidth
    }, 100);
    $('.health-wrapper').tooltipster('content', championHP+'/'+maxChampionHP);

    if (championHP<=0) {
        $('.champion-icon').effect('explode', {pieces: explodePieces}, 500, function() {
            randomizeChampion(); //Pick new champion before showing
            $(this).show();

            $('.health-wrapper').tooltipster('content', championHP+'/'+maxChampionHP); //Update hp tooltip
            // .stop(true) so that hp bar isn't late with big dps
            $('.health-progress').stop(true).animate({
                width: (274-((championHP/maxChampionHP)*274))
            }, 200);
        });
        //Get old xp before updating normal one
        oldXp=xp;
        xp+=xpPerKill;
        //Update xp on screen
        updateXp();
        championHP = maxChampionHP;
        gold+=goldPerKill;
        $('#goldSpan').html(gold);
    }
}

function updateXp() {
    //     ***** LEVEL UP *****
    //While we have too much xp
    while(xp>maxXp) {
        level++;
        oldXp=0;
        xp=(xp-maxXp);
        maxXp=Math.floor(maxXp*maxXpPerLevelMulti);
        maxChampionHP+=championHPperLevel;
        xpPerKill=Math.floor(xpPerKill*xpPerKillPerLevelMulti);
        //If level is multiple of 5 increase goldPerKill
        if(level%multipleOfGPKupgrade==0) {
            goldPerKill += level/multipleOfGPKupgrade;
            $('#gpkSpan').html(goldPerKill);
        }
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
    //Lower hp and run a hp check
    championHP-=dmg;
    updateHP();
}

function saveSettings() {
    //explodePieces
    explodePieces=$('#explosionPiecesInput').val();
    if(explodePieces<1) {
        explodePieces=1;
        $('#explosionPiecesInput').val(explodePieces);
    }
    $('#explosionPiecesDisplay').val(explodePieces);

    //TODO: easterEggs
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
    this.costid = 'cost-' + id; //Id of element containing item price
    this.levelid = 'level-' + id; //Id of element containing item level
    this.buyid = 'buy-' + id; //Id of buy button
    this.bonusid = 'bonus-' + id; //Id of bonus element
    this.req = req; //Required item (most of the time 1 less)
    this.unl = unl; //Item number (starts at 1)

    this.buy = function() {
        if (this.cost <= gold) {
            gold -= this.cost;
            gold = Math.floor(gold);
            $('#goldSpan').html(gold);
            this.level += 1;
            this.cost = Math.floor(this.cost * costPerBuyMulti);
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
                $.each(Item.instances, function() {
                    if(this.req<=topUnlocked) {
                        $('#'+this.id).slideDown(1000);
                    }
                });
            }
            //play sound
            $('#'+this.id).effect('highlight', { color: '#54E9E6'}, 1000);
            $('#'+this.buyid).effect('highlight', { color: 'white'}, 1000);
            this.render();
            return true;
        }
        return false;
    }

    this.render = function() {
        $('#'+this.costid).html(this.cost);
        $('#'+this.levelid).html(this.level);
        if(this.level>0) {
            $('#'+this.buyid).html('UPGRADE');
        }
        else {
            $('#'+this.buyid).html('BUY');
        }
    }

    Item.instances.push(this);
}

//Instances:
Item.instances = [];

var basicbow = new Item('basicbow', 'Cassie\'s Bow', 1, 1, 20, 0, 1); basicbow.level = 1; //Unique item, starts with level 1
var viktorrifle = new Item('viktorrifle', 'Viktor\'s Rifle', 2, 2, 50, 0, 2);
var killtoheal = new Item('killtoheal', 'Kill to Heal', 3, 2, 70, 1, 3);
var sniperrifle = new Item('sniperrifle', 'Kinessa\'s Sniper Rifle', 1, 3, 100, 2, 4);
var defthands = new Item('defthands', 'Deft Hands', 2, 5, 350, 3, 5);
//Add new items HERE


//On full page load
$(window).on('load', function() {
    $('.loadingOverlay').delay(500).fadeOut(500, function() {
        //On fade out complete
        $(this).remove();
    });
    $('#greetModal').modal().show();
    //Show legal notice
});

//On DOM load
$(function() {
    //Display confirm before leaving page
    $(window).bind('beforeunload', function(){
        return 'Are you sure you want to leave? Champions will be pretty sad :(';
    });
    //Init tooltipster
    $('.tooltipster').tooltipster({
        theme: ['tooltipster-punk', 'tooltipster-punk-customized'], //use custom theme
        animation: 'slide',
        delay: [300, 1500], //don't hide immediately
        animationDuration: [300, 1500],
        updateAnimation: 'scale'
    });
    $('.pc-navbar-element').tooltipster({
        theme: ['tooltipster-punk', 'tooltipster-punk-customized'], //use custom theme
        animation: 'fade',
        delay: 300,
        animationDuration: 300,
        side: 'bottom'
    });
    //Init custom scrollbar
    $('.pc-rightbar').mCustomScrollbar({
        axis: 'y',
        scrollbarPosition: 'inside',
        theme: 'minimal',
        contentTouchScroll: false, //pretty important for small screens
        documentTouchScroll: true
    });

    //Draw sidebar
    $.each(Item.instances, function() {
        //Create element with info from instance
        //TODO: Use template strings
        var currentElement = '<div class="pc-item" id="'+ this.id +'">' +
            '<img class="pc-item-image" src="'+ this.image +'" height="90px" width="90px" draggable="false">' +
            '<div class="pc-item-title">'+ this.name +'</div>' +
            '<div class="pc-item-stats">' +
                '<div class="pc-item-section">' +
                    '<div class="pc-item-cost"><span id="'+ this.costid +'"></span><img src="./img/gold.png" draggable="false" height="15" width="15"></div>' +
                    '<div class="pc-item-level" id="'+ this.levelid +'"></div>' +
                '</div><div class="pc-item-section pc-item-section2">' +
                    '<div class="pc-item-bonus tooltipster" id="'+ this.bonusid +'" title="placeholder">'+ this.bonus +'</div>' +
                    '<button class="pc-item-button" type="button" onclick="'+ this.id +'.buy();" id="'+ this.buyid +'">BUY</button>' +
                '</div>' +
            '</div>' +
        '</div>';
        //Add it to mCSB_container (generated by mCSB)
        $('.pc-rightbar').find('.mCSB_container').append(currentElement);
        if(this.req>topUnlocked) {
            //hide if requirement not fulfilled
            $('#'+this.id).hide();
        }


        //Initialize tooltipster on bonus element
        $('#'+this.bonusid).tooltipster({
            theme: ['tooltipster-punk', 'tooltipster-punk-customized'], //use custom theme
            contentAsHTML: true, //support for html
            animation: 'fade',
            delay: 300,
            animationDuration: 300
        });

        //1: DMG
        //2: DPS
        //3: GOLDPERKILL
        //Add class that handles text after bonus and update tooltip content
        switch (this.type) {
            case 1:
                $('#'+this.bonusid).addClass('pc-item-bonus-dmg');
                $('#'+this.bonusid).tooltipster('content', '<span style="color: #FF6600;">Damage per Click</span>');
                break;
            case 2:
                $('#'+this.bonusid).addClass('pc-item-bonus-dps');
                $('#'+this.bonusid).tooltipster('content', '<span style="color: #bd0a0a;">Damage per Second</span>');
                break;
            case 3:
                $('#'+this.bonusid).addClass('pc-item-bonus-gpk');
                $('#'+this.bonusid).tooltipster('content', '<span style="color: #DEAC3D;">Gold per Kill</span>');
                break;
            default:
                //if it isn't 1, 2 or 3 remove all classes, so that there is a clear indicator that something gone wrong
                $('#'+this.bonusid).removeClass('pc-item-bonus-dmg pc-item-bonus-dps pc-item-bonus-gpk');
                $('#'+this.bonusid).tooltipster('content', 'ERROR');
        }

        this.render();
        $(".pc-rightbar").mCustomScrollbar('update');
    });


    //Draw level indicator and pick random champion
    drawLvLCircle();
    randomizeChampion();

    //decrease lag on smaller devices
    //default of 32 pieces on 1280 screen width
    //scales with width, so it's 4 pieces on mobile
    //caps at 128
    explodePieces = Math.floor(Math.pow(2, ($(window).width()/1280)*5));
    if(explodePieces>128) {
        explodePieces = 128;
    }

    $('#explosionPiecesInput').val(explodePieces);
    $('#explosionPiecesDisplay').val(explodePieces);

    //     ***** DPS AND GPS TIMER *****
    var dpstimer = setInterval(function() {
        //Each second deal <dps> damage
        championHP-=dps;
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
