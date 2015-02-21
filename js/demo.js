;(function($, window, undefined){

  var $doc,
      $trigger,
      $body,
      $list,
      $item,
      $scrollTrigger;

  var MouseEvent = {
    CLICK : "click.app",
    SCROLL: "scroll.app",
    WHEEL : getMouseWheelEvent("app")
  };

  var isShow = false;


  // 初期化
  function initialize(){
    $doc = $(document);
    $trigger = $("#app-list-trigger");
    $list = $("#app-list");
    $body = $("#app-list-body");
    $scrollTrigger = $("#app-list-scroll-trigger");

    // トリガー(今回はアイコンマーク)のクリックに応じて、表示・非表示を行う
    $trigger.on(MouseEvent.CLICK, function(){
      if( isShow ) hideList();
      else showList();
      return false;
    });
  }


  // リストを表示
  function showList(){
    scrollDisable();

    // リストが表示されたら、それ以外の画面クリックで閉じるように
    $doc.on(MouseEvent.CLICK, function(e){
      hideList();
    });

    // 表示用クラスを設定後、documentのクリックに影響が出ないようにしておく
    $list
      .addClass("show")
      .on(MouseEvent.CLICK, function(e){
        e.stopPropagation();
      });

    // 「もっと見る」ボタンのクリックで、アニメーション付きでスクロール状態へ
    $scrollTrigger.on(MouseEvent.CLICK, function(e){
      e.preventDefault();
      scrollEnable(true);
    });

    // wheelevent内は多くコールされるため変数を外部化
    var original, delta;

    $body
      .on(MouseEvent.SCROLL, function(){
        // 一番上までスクロールしたらスクロールの状態を解除
        if( $body.scrollTop() === 0 && $list.hasClass("scroll") ){
          scrollDisable();
        }
      })
      .on(MouseEvent.WHEEL, function(e){
        // デフォルトのイベントを解除後、スクロール分を取得
        e.preventDefault();
        original = e.originalEvent;
        delta = original.deltaY ? -original.deltaY : original.wheelDelta ? original.wheelDelta : -(original.detail);

        // スクロール分を$bodyに割り当て
        $body.scrollTop( $body.scrollTop() - delta );

        // 下へのスクロールで尚且つ、表示状態なら、スクロール状態へ移行
        if( delta < 0 ){
          if( !$list.hasClass("scroll") ){
            scrollEnable(false);
          }
        }
      });

    // 表示フラグをたてておく
    isShow = true;
  }


  // リストを非表示
  function hideList(){
    // 非表示に
    $list.removeClass("show");

    // 表示時に割り当てたイベントを解除しておく
    $doc.off(MouseEvent.CLICK);
    $body
      .off(MouseEvent.SCROLL)
      .off(MouseEvent.WHEEL);

    // 表示フラグを解除
    isShow = false;
  }


  // スクロール状態を有効化
  function scrollEnable(useAnimation){
    $list.addClass("scroll");

    if( useAnimation === true ){
      $body.stop().animate({"scrollTop": 350}, 400, "swing");
    }
  }


  // スクロール状態を無効化
  function scrollDisable(){
    $list.removeClass("scroll");
  }

  // マウスホイールのイベントを取得
  function getMouseWheelEvent(prefix){
    var eventName = "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
    prefix = prefix !== undefined ? "." + prefix : "";
    return eventName + prefix;
  }


  // DOMContentLoaded
  $(initialize);


}(jQuery, window));