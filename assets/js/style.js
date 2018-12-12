var Foo = { template: '#compo-member' }
var Bar = { template: '<div>bar</div>' }

var routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
]

var router = new VueRouter({
    routes // `routes: routes` の短縮表記
})

var app = new Vue({
    router
}).$mount('#app')


$(function() {



    var Acoordion = function(el) {
        this.el = $(el);
    };
    Acoordion.prototype.fn = function() {
        var that = this;
        this.el.on('click', function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).next().hide();
                $(this).parent().removeClass('active');
                $('.js-modalBk').css({
                    height: 'auto'
                }).fadeOut();
                return false;
            }
            $(this).addClass('active');
            $(this).next().show();
            $(this).parent().addClass('active');
            $('.js-modalBk').css({
                height: '100vh'
            }).fadeIn();
        });
    };
    Acoordion.prototype.bodyActive = function() {
        var that = this;
        this.el.on('click', function() {
            if ($('body').hasClass('active')) {
                $('body').removeClass('active');
                return false;
            }
            $('body').addClass('active');
        });
    };

    var serviceAccord = new Acoordion('.serviceList__overview');
    serviceAccord.fn();

    var serviceList__title = new Acoordion('.serviceList__title');
    serviceList__title.fn();

    var searchChoice__prefectures = new Acoordion('.searchChoice__select-prefectures');
    searchChoice__prefectures.fn();
    searchChoice__prefectures.bodyActive();

    var searchChoice__product = new Acoordion('.searchChoice__select-product');
    searchChoice__product.fn();

    var detailServiceList__title = new Acoordion('.detailServiceList__title');
    detailServiceList__title.fn();



    var AccordClose = function(el, closeEl, closeElParent) {
        this.el = $(el);
        this.closeEl = $(closeEl);
        this.closeElParent = $(closeElParent);
    };
    AccordClose.prototype.fn = function() {
        var that = this;
        this.el.on('click', function() {
            $('body').removeClass('active');
            that.closeEl.hide();
            that.closeElParent.removeClass('active');
            that.closeElParent.find('.searchChoice__select').removeClass('active');
            that.closeElParent.parent('.serviceListParent').removeClass('active');
        });
    };
    AccordClose.prototype.modalBk = function() {
        var that = this;
        this.el.on('click', function() {
            $('.js-modalBk').fadeOut();
        });
    };

    var closeBtn = new AccordClose('.js-serviceList-close', '.serviceList__inner', '.serviceList__overview');
    closeBtn.fn();

    var btnBack_prefectures = new AccordClose('.btn-back-prefectures span', '.checkItemWrap', '.searchChoice__prefectures');
    btnBack_prefectures.fn();
    btnBack_prefectures.modalBk();

    var btnBack_service = new AccordClose('.btn-back-service span', '.checkItemWrap', '');
    btnBack_service.fn();

    var decideBtn_prefectures = new AccordClose('.decide-prefectures', '.checkItemWrap', '.searchChoice__prefectures');
    decideBtn_prefectures.fn();
    decideBtn_prefectures.modalBk();

    var decideBtn_productAndServic = new AccordClose('.decide-productAndService', '.checkItemWrap', '.searchChoice__prefectures');
    decideBtn_productAndServic.fn();




    var ScrollPosReset = function(el, hideEl) {
        this.el = $(el);
        this.hideEl = $(hideEl);
    };
    ScrollPosReset.prototype.defaultFn = function() {
        var that = this;
        that.el.on('click', function() {
            that.hideEl.fadeOut();
            $('body, .searchChoice__select').removeClass('active');

            var speed = 400;
            var position = $('#searchForm').offset().top;
            $('body,html').stop().animate({ scrollTop: position }, speed, 'swing');
            return false;
        });
    };

    var clickBk = new ScrollPosReset('.js-modalBk', '.js-modalBk, .productAndServiceWrap, .checkItemWrap, .checkItemWrap-productAndService');
    clickBk.defaultFn();

    var clickDecideBtn = new ScrollPosReset('.checkItemSlectBtn-decision', '');
    clickDecideBtn.defaultFn();

    var clickCloseBtn = new ScrollPosReset('.btn-close', '.js-modalBk, .productAndServiceWrap, .checkItemWrap, .checkItemWrap-productAndService');
    clickCloseBtn.defaultFn();






    var checkItem = function() {
        var $checkItemParent = $('.checkbox dt, .checkbox dd, .flag');
        var $checkItem = $('.checkItem');
        var $decideBtn = $('.checkItemSlectBtn-decision'); // 決定ボタン

        $checkItem.on('click', function() {
            $(this).parents('.checkbox').find('input[type="radio"]').parent().removeClass('select');
            if ($(this).parent().hasClass('select')) {
                $(this).parent().removeClass('select');
                return;
            }
            $(this).parent().addClass('select');
        });


        // リセットボタンをクリック
        var ResetBtn = function(resetBtn, defaultText) {
            this.resetBtn = $(resetBtn);
            this.defaultText = defaultText;
        };
        ResetBtn.prototype.fn = function() {
            var that = this;
            this.resetBtn.on('click', function() {
                var index = $('.productAndServiceTab').find('.active').index();
                $('.productAndServiceTab__inner > li').eq(index).find('dt, dd, .flag').removeClass('select').find('.checkItem').prop("checked", false);
                console.log(index);
                $(this).parents('.searchChoice__prefectures').find($checkItemParent).removeClass('select');
                $(this).parents('.searchChoice__prefectures').find($checkItem).prop("checked", false);

                $(this).parents('.searchChoice__inner').find('.searchChoice__select').text(that.defaultText);
            });
        };
        var reset_prefecturesText = new ResetBtn('.reset-prefectures', '都道府県から検索');
        reset_prefecturesText.fn();

        var reset_productAndService = new ResetBtn('.reset-productAndService', '取り扱い商品・サービスから絞り込む');
        reset_productAndService.fn();



        // 決定ボタンをクリック
        var DecideBtn = function(checkParent, defaultText) {
            this.checkParent = $(checkParent);
            this.defaultText = defaultText;
        };
        DecideBtn.prototype.defaultFn = function(tabParent) {
            var that = this;
            this.checkParent.find($decideBtn).on('click', function() {
                var $this = $(this);
                var $val = that.checkParent.find('.checkItem:checked').map(function() {
                    return $(this).val();
                }).get();

                $(this).parents('.searchChoice__inner').find('.searchChoice__select').text($val);
                if ($val == '') {
                    $this.parents('.searchChoice__inner').find('.searchChoice__select').text(that.defaultText);
                }
            });
        };
        DecideBtn.prototype.productAndService = function(tabParent) {
            var that = this;
            this.checkParent.find($decideBtn).on('click', function() {
                var $this = $(this);
                var tabActive = $this.parents('.checkItemWrap').find('.productAndServiceTab__inner').find('li.active');
                var tabIndex = tabActive.index();
                console.log(tabIndex);

                // 『 指定なし 』 のテキストをvalに置き換え
                var tabActiveVal = tabActive.find('.checkItem:checked').val();
                console.log(tabActiveVal);
                $('.productAndService li').eq(tabIndex).find('span').text(tabActiveVal);
                $('.productAndService li').eq(tabIndex).addClass('active');
                if (tabActiveVal == undefined) {
                    $('.productAndService li').eq(tabIndex).find('span').text('指定なし');
                    $('.productAndService li').eq(tabIndex).removeClass('active');
                }

                // 『 取り扱い商品・サービスから絞り込む 』 のテキストをvalに置き換え
                var $val = that.checkParent.find('.checkItem:checked').map(function() {
                    return $(this).val();
                }).get();
                $(this).parents('.searchChoice__inner').find('.searchChoice__select').text($val);
                if ($val == '') {
                    $this.parents('.searchChoice__inner').find('.searchChoice__select').text(that.defaultText);
                }
            });
        };

        var prefecturesText_decide = new DecideBtn('.searchChoice__prefectures', '都道府県から検索');
        prefecturesText_decide.defaultFn();

        var productAndSearvice_decide = new DecideBtn('.searchChoice__product', '取り扱い商品・サービスから絞り込む');
        productAndSearvice_decide.productAndService();
    }();



    var choiceTab = function() {
        var $tabList = $('.productAndService > li');
        var $tabListEl = $('.checkItemWrap');
        var $modalTabParent = $('.productAndServiceTab');
        var $modalTab = $modalTabParent.find('li');
        var $tabEl = $('.productAndServiceTab__inner > li');

        $tabList.on('click', function() {
            $('body').addClass('active');
            var index = $(this).index();
            $('.checkItemWrap-productAndService').show();
            $modalTab.removeClass('active');
            $tabEl.removeClass('active');

            $modalTab.eq(index).addClass('active');
            $tabEl.eq(index).addClass('active');
        });

        $modalTab.on('click', function() {
            var index = $(this).index();
            // console.log(index);
            $modalTab.removeClass('active');
            $(this).addClass('active');
            $tabEl.removeClass('active');
            $tabEl.eq(index).addClass('active');
        });
    }();

    var choiceAlphabet = function() {
        $('.choiceAlphabet').on('click', function() {
            $(this).next().show();
        });
        $('.alphabetList a').on('click', function() {
            $('.alphabetList a').removeClass('active');
            $(this).addClass('active');
            $('.checkItemWrap').addClass('active');
        });
        AlphabetClose = function(el) {
            this.el = $(el);
        };
        AlphabetClose.prototype.click = function() {
            this.el.on('click', function() {
                $('.checkItemWrap').removeClass('active');
                $('.alphabetWrap').hide();
            });
        };
        var alphabet_btnBack = new AlphabetClose('.btn-back span');
        alphabet_btnBack.click();

        var alphabet_decideBtn = new AlphabetClose('.checkItemSlectBtn-decision');
        alphabet_decideBtn.click();
    }();


    var MoreShowBtn = function(el) {
        this.el = $(el);
    };
    MoreShowBtn.prototype.showEl = function() {
        var that = this;
        $('.btn-moreShow').on('click', function() {
            $(this).hide();
            that.el.fadeIn();
        });
    };
    var moreBtn = new MoreShowBtn('.storeList >li');
    moreBtn.showEl();




});