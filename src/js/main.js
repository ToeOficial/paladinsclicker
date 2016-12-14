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

//Constants
//Balance
const championHPperLevel = 2;
const maxXpPerLevelMulti = 1.3;
const xpPerKillPerLevelMulti = 1.05;
const multipleOfGPKupgrade = 5;
const costPerBuyMulti = 1.4;

const easterEggChance = 5;

//Colors
const lightBlueColor = '#54E9E6';
const darkCyanColor = '#128D8A';

//Settings
var explodePieces = 32;
var easterEggs = false;
var isMobile = false;
var shotVolume = 0.3;

//Get random champion from the list
function randomizeChampion() {
    activeChampion = CHAMPION_LIST[Math.floor(Math.random()*CHAMPION_LIST.length)]; //Pick random champion

    //Update champion info in GUI
    $('.champion-icon').attr('src', './img/champicons/'+activeChampion+'.png');
    $('.champion-icon').attr('alt', activeChampion);
    $('.champion-name').html(activeChampion);

    //Easter eggs
    if(easterEggs==true) {
        checkNameEasterEggs();
    }
}

//Try to change nickname
function checkNameEasterEggs() {
    let chosenNum = Math.floor(Math.random() * (100 + 1));
    if(chosenNum <= easterEggChance) {
        let newName;
        switch (activeChampion) {
            case 'Androxus':
                newName = 'It\'s High Noon';
                break;
            case 'Barik':
                newName = 'Torbjörn';
                break;
            case 'Cassie':
                newName = 'Colossal Chest';
                break;
            case 'Drogoz':
                newName = 'One Punch Man';
                break;
            case 'Fernando':
                newName = 'FERRRNANDO';
                break;
            case 'Grover':
                newName = 'Tree';
                break;
            case 'Makoa':
                newName = 'Bowser';
                break;
            case 'Skye':
                newName = 'That One Skye Pose';
                break;
            case 'Sha Lin':
                newName = 'Aladdin';
                break;
            case 'Viktor':
                newName = 'Soldier 77';
                break;
            case 'Ying':
                newName = 'Yang';
                break;
            default:
                newName = activeChampion;
        }

        $('.champion-name').html(newName);
    }
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
        updateGold();
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
        if(isMobile==false) {
            $('.level-text').effect('highlight', { color: lightBlueColor}, 1500);
        }
        $('.level-text').html(level);
    }
    $('.level-text').tooltipster('content', xp+'/'+maxXp);
    drawLvLCircle();
}

function updateGold() {
    $('#goldSpan').html(gold);
    $.each(Item.instances, function() {
        this.render();
    });
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
    ctx.strokeStyle = darkCyanColor;
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
    ctx.strokeStyle = lightBlueColor;
    ctx.stroke();

    //Old xp
    ctx.beginPath();
    ctx.arc(centerX, centerY, 114, 3.5 * Math.PI, (3.5+(2*(oldXp/maxXp)))*Math.PI, false);
    ctx.strokeStyle = darkCyanColor;
    ctx.stroke();
}

//Function running on each click
function click() {
    //Lower hp and run a hp check
    championHP-=dmg;
    updateHP();
    if(isMobile==false) {
        $('.floatingNumsWrapper').append($('<div class="dmgFloatingNum dmgFloat'+(Math.floor(Math.random() * 3) + 1).toString()+' stats-orange">'+dmg+'</div>'));
        //TODO: Remove element after animation
    }
    var shotSound = new Audio('./audio/shot/cassie.mp3');
    shotSound.volume = shotVolume;
    shotSound.play();
}

function saveSettings() {
    //explodePieces
    explodePieces = $('#explosionPiecesInput').val();
    if(explodePieces < 1) {
        explodePieces = 1;
        $('#explosionPiecesInput').val(explodePieces);
    }
    $('#explosionPiecesDisplay').val(explodePieces);

    //Mobile
    isMobile = $('#isMobileInput').prop('checked');
    if(isMobile) {
        $.each(Item.instances, function() {
            $('#'+this.buyid).removeClass('pc-item-button-expensive');
        });
    }
    else {
        updateGold();
    }

    //easter eggs
    easterEggs = $('#easterEggsInput').prop('checked');
    $.each(Item.instances, function() {
        if(this.easterEgg==true && this.req<=topUnlocked) {
            if(easterEggs==false) {
                $('#'+this.id).stop().fadeOut(1000);
            }
            if(easterEggs==true) {
                $('#'+this.id).stop().fadeIn(1000);
            }
        }
    });
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
    this.costMulti = costPerBuyMulti;
    this.level = 0; //Starting level (by default 0, because we don't have it unlocked)
    this.image = './img/items/' + id + '.png'; //Image stored in ./img/items/ with .png extension
    this.costid = 'cost-' + id; //Id of element containing item price
    this.levelid = 'level-' + id; //Id of element containing item level
    this.buyid = 'buy-' + id; //Id of buy button
    this.bonusid = 'bonus-' + id; //Id of bonus element
    this.req = req; //Required item (most of the time 1 less)
    this.unl = unl; //Item number (starts at 1)
    this.easterEgg = false;
    this.max = null;

    this.buy = function() {
        if(this.max != null) {
            if(this.level>=this.max) {
                this.render();
                return false;
            }
        }
        if (this.cost <= gold) {
            gold -= this.cost;
            gold = Math.floor(gold);
            updateGold();
            this.level += 1;
            this.cost = Math.floor(this.cost * this.costMulti);
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
                        if((this.easterEgg==true&&easterEggs==true)||this.easterEgg==false) {
                            $('#'+this.id).slideDown(1000);
                        }
                    }
                });
            }
            //play sound
            if(isMobile==false) {
                $('#'+this.id).effect('highlight', { color: lightBlueColor}, 1000);
                $('#'+this.buyid).effect('highlight', { color: 'white'}, 1000);
            }
            this.render();
            return true;
        }
        return false;
    }

    this.render = function() {
        $('#'+this.costid).html(this.cost);
        $('#'+this.levelid).html(this.level);

        if(isMobile==false) {
            if((this.max != null && this.level<this.max)||this.max==null) {
                if(this.cost > gold) {
                    $('#'+this.buyid).addClass('pc-item-button-expensive');
                }
                else {
                    $('#'+this.buyid).removeClass('pc-item-button-expensive');
                }
            }
        }

        if(this.level > 0) {
            $('#'+this.buyid).html('UPGRADE');
            if(isMobile==false) {
                if(this.max != null) {
                    if(this.level >= this.max) {
                        $('#'+this.buyid).html('MAX LEVEL');
                        $('#'+this.buyid).addClass('pc-item-button-disabled');
                    }
                    else {
                        $('#'+this.buyid).html('UPGRADE');
                        $('#'+this.buyid).removeClass('pc-item-button-disabled');
                    }
                }
            }
        }
        else {
            $('#'+this.buyid).html('BUY');
        }
    }

    Item.instances.push(this);
}

//Instances:
Item.instances = [];

var basicbow = new Item('basicbow', 'Cassie\'s Bow', 1, 1, 20, 0, 1);
basicbow.level = 1; //Unique item, starts with level 1
var viktorrifle = new Item('viktorrifle', 'Viktor\'s Rifle', 2, 2, 50, 0, 2);
var killtoheal = new Item('killtoheal', 'Kill to Heal', 3, 2, 70, 1, 3);
var sniperrifle = new Item('sniperrifle', 'Kinessa\'s Sniper Rifle', 1, 3, 100, 2, 4);
var defthands = new Item('defthands', 'Deft Hands', 2, 5, 350, 3, 5);
var aggression = new Item('aggression', 'Aggression', 1, 1, 400, 4, 6);
aggression.easterEgg = true; /*Easter Egg Item*/ aggression.costMulti = 2; aggression.max = 3; //Just to make it even worse
//Add new items HERE
//id, name, type, bonus, cost, req, unl


//On full page load
$(window).on('load', function() {
    $('.loadingOverlay').delay(500).fadeOut(500, function() {
        //On fade out complete
        $(this).remove();
    });
    $('#greetModal').modal().show();
    //Show legal notice
});

//Reset data
function resetData() {
    if(confirm('You will lose all your progress. Do you want to proceed?')) {
        localStorage.clear();
        location.reload();
    }
}

//Local storage helper functions
//TODO: Add items
function saveLocalStorage() {
    localStorage.setItem('maxChampionHP', maxChampionHP);
    localStorage.setItem('dmg', dmg);
    localStorage.setItem('dps', dps);
    localStorage.setItem('gold', gold);
    localStorage.setItem('goldPerKill', goldPerKill);
    localStorage.setItem('topUnlocked', topUnlocked);
    localStorage.setItem('level', level);
    localStorage.setItem('xp', xp);
    localStorage.setItem('xpPerKill', xpPerKill);
    localStorage.setItem('maxXp', maxXp);
    //Settings
    localStorage.setItem('easterEggs', easterEggs);
    localStorage.setItem('shotVolume', shotVolume);
    //Items
    $.each(Item.instances, function() {
        localStorage.setItem(this.id, JSON.stringify(this));
    });
}

function readLocalStorage() {
    maxChampionHP = parseInt(localStorage.getItem('maxChampionHP'));
    dmg = parseInt(localStorage.getItem('dmg'));
    $('#damageSpan').html(dmg);
    dps = parseInt(localStorage.getItem('dps'));
    $('#dpsSpan').html(dps);
    gold = parseInt(localStorage.getItem('gold'));
    goldPerKill = parseInt(localStorage.getItem('goldPerKill'));
    $('#gpkSpan').html(goldPerKill);
    topUnlocked = parseInt(localStorage.getItem('topUnlocked'));
    level = parseInt(localStorage.getItem('level'));
    $('.level-text').html(level);
    xp = parseInt(localStorage.getItem('xp'));
    oldXp = xp;
    xpPerKill = parseInt(localStorage.getItem('xpPerKill'));
    maxXp = parseInt(localStorage.getItem('maxXp'));
    //Settings
    easterEggs = localStorage.getItem('easterEggs') == "true";
    $('#explosionPiecesInput').val(easterEggs);
    shotVolume = parseFloat(localStorage.getItem('shotVolume'));

    $.each(Item.instances, function() {
        window[this.id] = Object.assign(window[this.id], JSON.parse(localStorage.getItem(this.id)));
        Item.instances[this.id] = window[this.id];


        window[this.id].render();
    });

    //Update UI
    updateHP();
    updateXp();
    updateGold();
    saveSettings();
}


//On DOM load
$(function() {
    //Display confirm before leaving page
    $(window).bind('beforeunload', function(){
        saveLocalStorage();
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

    //Local storage
    if (typeof(Storage) !== "undefined") {
        $('#localStorageDisplay').html('This website uses <a href="http://www.w3schools.com/html/html5_webstorage.asp">HTML5 Web Storage</a>. By continuing to use this website you are giving consent to web storage being used.');
        if (localStorage.visited) {
            readLocalStorage();
        }
        else {
            saveLocalStorage();
            localStorage.visited = true;
        }

    } else {
        //No Web Storage support
        $('#localStorageDisplay').html('Sorry, your browser doesn\'t support Web Storage thus your progress can\'t be saved across sessions.');
    }

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
        var currentElement =
        `<div class="pc-item" id="${this.id}">
            <img class="pc-item-image" src="${this.image}" height="90px" width="90px" draggable="false">
            <div class="pc-item-title">${this.name}</div>
            <div class="pc-item-stats">
                <div class="pc-item-section">
                    <div class="pc-item-cost"><span id="${this.costid}"></span><img src="./img/gold.png" draggable="false" height="15" width="15"></div>
                    <div class="pc-item-level" id="${this.levelid}"></div>
                </div><div class="pc-item-section pc-item-section2">
                    <div class="pc-item-bonus tooltipster" id="${this.bonusid}" title="placeholder">${this.bonus}</div>
                    <button class="pc-item-button" type="button" onclick="${this.id}.buy();" id="${this.buyid}">BUY</button>
                </div>
            </div>
        </div>`
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
    if($(window).width()<=900) {
        isMobile = true;
        $('#isMobileInput').prop('checked', true);
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
