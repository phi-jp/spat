
/* 
 * spat 0.0.2
 * single page application framework for riot.js
 * MIT Licensed
 * 
 * Copyright (C) 2016 phi, http://phiary.me
 */

'use strict';

var spat = {
  nav: {},
  modal: {},
  toast: {},
};

riot.tag2('spat-modal', '', 'spat-modal,[data-is="spat-modal"]{position:fixed;transform:translate3d(0, 0, 0);top:0;right:0;bottom:0;left:0;display:block;z-index:9999} spat-modal modal-content,[data-is="spat-modal"] modal-content{position:absolute;display:block;left:0;right:0;top:0;bottom:0}@keyframes modal-left-in{ 0%{transform:translateX(-200px);opacity:0} 100%{transform:translateX(0);opacity:1}}@keyframes modal-left-out{ 0%{transform:translateX(0);opacity:1} 100%{transform:translateX(-200px);opacity:0}}@keyframes modal-right-in{ 0%{transform:translateX(200px);opacity:0} 100%{transform:translateX(0);opacity:1}}@keyframes modal-right-out{ 0%{transform:translateX(0);opacity:1} 100%{transform:translateX(200px);opacity:0}}@keyframes modal-bottom-in{ 0%{transform:translateY(200px);opacity:0} 100%{transform:translateY(0);opacity:1}}@keyframes modal-bottom-out{ 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(200px);opacity:0}}@keyframes modal-scale-in{ 0%{transform:scale(1.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes modal-scale-out{ 0%{transform:scale(1);opacity:1} 100%{transform:scale(.5);opacity:0}}', 'show="{visible}"', function(opts) {
    var self = this;

    this.open = function(page, options) {
      var elm = document.createElement('modal-content');
      self.root.appendChild(elm);
      var tag = riot.mount(elm, page, options)[0];

      self._openModal(tag);

      tag.root.onclick = function(e) {
        if (tag.opts.dismissible !== false && e.currentTarget === e.target) {
          tag.close();
        }
      };

      tag.close = function() {
        self._closeModal(tag);
      };
      tag.update();

      self.visible = true;
      self.update();

      return tag;
    };
    this.alert = function(text, title) {
      return self.open('modal-alert', {
        text: text,
        title: title,
      });
    };
    this.confirm = function(text, title) {
      return self.open('modal-confirm', {
        text: text,
        title: title,
      });
    };
    this.indicator = function() {
      return self.open('modal-indicator', {
        dismissible: false,
      });
    };
    this.actionsheet = function(options) {
      return self.open('spat-modal-actionsheet', options);
    }

    this.close = function() {
      var content = this.root.querySelector('modal-content');
      if (!content) {
        self.visible = false;
      }
      self.update();
    };

    this._openModal = function(modal) {
      var animation = modal.root.getAttribute('spat-animation') || 'scale';
      var modalElm = modal.refs.modal;

      if (animation) {
        modalElm.style.animationName = 'modal-' + animation + '-in';
        modalElm.style.animationDuration = '256ms';
        modalElm.style.animationPlayState = 'running';

        onceEvent(modalElm, 'animationend', function(e) {
          modalElm.style.animationPlayState = 'paused';
        });
      }
    };

    this._closeModal = function(modal) {
      var animation = modal.root.getAttribute('spat-animation') || 'scale';
      var modalElm = modal.refs.modal;

      if (animation) {
        modalElm.style.animationName = 'modal-' + animation + '-out';
        modalElm.style.animationDuration = '256ms';
        modalElm.style.animationPlayState = 'running';

        onceEvent(modalElm, 'animationend', function(e) {
          modal.unmount();
          self.close();
        });
      }
    };

    window.spat.modal = this;

    var onceEvent = function(elm, evtName, fn) {
      var temp = function() {
        elm.removeEventListener(evtName, temp, false);
        fn();
      };
      elm.addEventListener(evtName, temp, false);
    };

    window.spat.modal = this;

});
riot.tag2('spat-modal-actionsheet', '<div ref="modal" class="modal"> <div class="spat-modal-content"> <div if="{opts.title}" class="spat-modal-title">{opts.title}</div> <div each="{opts.buttons}" onclick="{select}" class="spat-modal-button {style}">{label}</div> </div> <div class="spat-modal-footer"> <div onclick="{close}" class="spat-modal-button">Cancel</div> </div> </div>', 'spat-modal-actionsheet,[data-is="spat-modal-actionsheet"]{display:flex;justify-content:center;align-items:flex-end;background-color:rgba(0,0,0,0.1)} spat-modal-actionsheet .modal,[data-is="spat-modal-actionsheet"] .modal{margin:16px;width:100%} spat-modal-actionsheet .modal .spat-modal-content,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content{margin-bottom:12px;border-radius:8px;overflow:hidden} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-title,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-title{background-color:rgba(255,255,255,0.95);text-align:center;padding:12px;border-bottom:1px solid rgba(0,0,0,0.1);color:#666;font-size:14px} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button{font-weight:bold;background-color:rgba(255,255,255,0.95);text-align:center;padding:12px;color:blue;cursor:pointer} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button:not(:last-child),[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button:not(:last-child){border-bottom:1px solid rgba(0,0,0,0.1)} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button.danger,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button.danger{color:red} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button.disable,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button.disable{color:#b4b4b4} spat-modal-actionsheet .modal .spat-modal-footer,[data-is="spat-modal-actionsheet"] .modal .spat-modal-footer{border-radius:8px;overflow:hidden} spat-modal-actionsheet .modal .spat-modal-footer .spat-modal-button,[data-is="spat-modal-actionsheet"] .modal .spat-modal-footer .spat-modal-button{cursor:pointer;color:blue;font-weight:bold;background-color:rgba(255,255,255,0.95);text-align:center;padding:12px}', 'spat-animation="bottom"', function(opts) {
    var self = this;
    this.select = function(e) {
      self.trigger('select', e);
      self.close();
    };
});

riot.tag2('spat-nav', '<div ref="pages" class="spat-pages"></div> <div if="{_locked}" ref="lock" class="spat-lock"></div>', 'spat-nav,[data-is="spat-nav"]{position:relative;display:block;width:100%;height:100%} spat-nav .spat-pages,[data-is="spat-nav"] .spat-pages{position:absolute;width:100%;height:100%} spat-nav .spat-pages .spat-page,[data-is="spat-nav"] .spat-pages .spat-page{position:absolute;width:100%;height:100%;backface-visibility:hidden;animation-fill-mode:forwards;overflow:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch} spat-nav .spat-pages .spat-page.spat-hide,[data-is="spat-nav"] .spat-pages .spat-page.spat-hide{display:none} spat-nav .spat-lock,[data-is="spat-nav"] .spat-lock{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background-color:transparent}@keyframes slide-in{ 0%{transform:translate(250px, 0);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes slide-out{ 0%{opacity:1} 100%{opacity:.8}}@keyframes scale-in{ 0%{transform:scale(.5);opacity:0} 0%{transform:scale(.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes scale-out{ 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0}}@keyframes rotate-in{ 0%{transform:perspective(800px) rotateY(180deg);opacity:0} 100%{transform:perspective(800px) rotateY(0deg);opacity:1}}@keyframes rotate-out{ 0%{transform:perspective(800px) rotateY(0deg);opacity:1} 100%{transform:perspective(800px) rotateY(-180deg);opacity:0}}', '', function(opts) {
    var self = this;

    this._back = false;
    this._locked = false;

    this.lock = function(color) {
      this._locked = true;
      this.update();
      if (color) {
        this.refs.lock.style.backgroundColor = color;
      }
    };

    this.unlock = function() {
      this._locked = false;
      this.refs.lock.style.backgroundColor = '';
      this.update();
    };

    this.swap = function(tagName, opts) {
      var prevPage = this.currentPage;

      var page = this.refs.pages.querySelector('[data-is=' + tagName + ']');

      if(!page || prevPage.dataset.is === tagName) {
        page = document.createElement('div');
        page.classList.add('spat-page');
        this.refs.pages.appendChild(page);
        riot.mount(page, tagName);
      }
      else {
        if (!this._back) {

          var parent = page.parentNode;
          parent.removeChild(page);
          parent.appendChild(page);
        }
      };

      var e = {
        prevPage: prevPage,
        currentPage: page,
        query: route.query(),
        args: Array.prototype.slice.call(arguments),

        opts: opts,
        back: self._back,
      };
      page.classList.remove('spat-hide');
      page._tag.trigger('show', e);

      this.lock();

      swapAnimation(page, prevPage, this._back).then(function() {

        if (prevPage) {
          prevPage.classList.add('spat-hide');
        }

        self.unlock();
      });

      self._back = false;

      this.currentPage = page;
      this.prevPage = prevPage;

      delete spat.nav.opts;
    };

    this.goto = function(e, opts) {
      var path = '';
      if (typeof e === 'string') {
        path = e;
      }
      else {
        path = e.currentTarget.getAttribute('href');
        e.preventDefault();
      }

      route(path);
    };
    this.back = function(index, opts) {
      self._back = true;
      if (typeof index === 'number') {
        history.go(-index);
      }
      else {
        history.back();
      }
    };

    window.spat.nav = this;

    var swapAnimation = function(next, prev, back) {
      var animation = (back !== true) ? next.getAttribute('spat-animation') : prev.getAttribute('spat-animation');

      animation = animation || self.animation;

      if (!animation) {
        return Promise.resolve();
      }

      if (!back) {
        var direction = '';
        var nextAnimation = animation + '-in';
        var prevAnimation = animation + '-out'
        var duration = '256ms';
      }
      else {
        var direction = 'reverse';
        var nextAnimation = animation + '-out';
        var prevAnimation = animation + '-in'
        var duration = '256ms';
      }

      return new Promise(function(resolve) {

        setAnimation(next, nextAnimation, duration, direction);
        onceEvent(next, 'animationend', function() {
          setAnimation(next);
          resolve();
        });

        if (prev) {
          setAnimation(prev, prevAnimation, duration, direction);
          onceEvent(prev, 'animationend', function() {
            setAnimation(prev);
          });
        }
      });
    };
    var setAnimation = function(elm, name, duration, direction) {
      elm.style.animationDuration = duration || '';
      elm.style.animationDirection = direction || '';
      elm.style.animationName = name || '';
    };
    var onceEvent = function(elm, evtName, fn) {
      var temp = function() {
        elm.removeEventListener(evtName, temp, false);
        fn();
      };
      elm.addEventListener(evtName, temp, false);
    };
});

riot.tag2('spat-scroll-loader', '<div if="{_show}" class="loader"><span>loading...</span></div>', 'spat-scroll-loader,[data-is="spat-scroll-loader"]{display:block} spat-scroll-loader .loader,[data-is="spat-scroll-loader"] .loader{display:flex;justify-content:center;align-items:center;height:44px} spat-scroll-loader .loader [class^=icon],[data-is="spat-scroll-loader"] .loader [class^=icon]{display:block;font-size:22px}@keyframes scroll-loader-spin{ from{transform:rotate(0deg)} to{transform:rotate(360deg)}}', '', function(opts) {
    var self = this;

    this.init = function() {
      this.page = 0;
      this._show = true;
      this._lock = false;

      return this;
    };
    this.init();

    this.on('mount', function() {
      var list = opts.parent || this.root.parentNode;
      list.onscroll = function(e) {
        var max = e.target.scrollHeight - e.target.offsetHeight-1;
        if (e.target.scrollTop >= max) {
          self.load();
        }
      };
    });

    this.load = function() {
      if (this._lock === true) return ;

      this._lock = true;
      var d = opts.onload(++this.page);
      d.done(function(res) {
        if (self._show) {
          self._lock = false;
          self.update();
        }
      });
    };

    this.show = function() { this._show = true; return this; }
    this.hide = function() { this._show = false; return this; }

    this.lock = function() { this._lock = true; return this; }
    this.unlock = function() { this._lock = false; return this; }
});

riot.tag2('spat-toast', '', 'spat-toast,[data-is="spat-toast"]{display:block;position:fixed;top:20px;right:20px;z-index:9999} spat-toast toast-item,[data-is="spat-toast"] toast-item{margin-bottom:10px}', '', function(opts) {
    var self = this;
    window.spat.toast = this;

    this.message = function(text, timeout) {
      var elm = document.createElement('toast-item');
      self.root.appendChild(elm);
      var tag = riot.mount(elm, 'spat-toast-item', {
        text: text || 'Hello, Spat.js!',
        timeout: timeout,
      })[0];

      tag.close = function() {
        tag.unmount();
      };
    };

});
riot.tag2('spat-toast-item', '<span>{opts.text}</span>', 'spat-toast-item,[data-is="spat-toast-item"]{display:flex;padding:8px 20px;background-color:#808080;color:white;border-radius:3px;animation:toast-appear 500ms} spat-toast-item.disappear,[data-is="spat-toast-item"].disappear{animation:toast-disappear 500ms}@keyframes toast-appear{ 0%{transform:translateY(40px);opacity:0} 100%{transform:translateY(0);opacity:1}}@keyframes toast-disappear{ 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-40px);opacity:0}}', '', function(opts) {
    var self = this;
    var timeout = opts.timeout || 2000;

    this.on('mount', function() {
      setTimeout(function() {
        self.root.classList.add('disappear');
        self.root.addEventListener('animationend', function() {
          self.close();
        });
      }, timeout);
    });
});

riot.tag2('spat-nav-old', '<div name="contents" class="spat-contents"></div> <div if="{lock}" class="spat-lock"></div>', 'spat-nav-old,[data-is="spat-nav-old"]{display:block;width:100%;height:100%} spat-nav-old .spat-content,[data-is="spat-nav-old"] .spat-content{position:absolute;top:0;right:0;bottom:0;left:0;display:block;width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch;backface-visibility:hidden;z-index:5;animation-duration:300ms;animation-timing-function:ease-in-out} spat-nav-old .spat-content.spat-hide,[data-is="spat-nav-old"] .spat-content.spat-hide{display:none} spat-nav-old .spat-lock,[data-is="spat-nav-old"] .spat-lock{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background-color:rgba(255,0,0,0.2);background-color:transparent}@keyframes slide-in{ 0%{transform:translate(250px, 0);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes slide-out{ 0%{opacity:1} 100%{opacity:.8}}@keyframes scale-in{ 0%{transform:scale(.5);opacity:0} 0%{transform:scale(.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes scale-out{ 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0}}@keyframes rotate-in{ 0%{transform:perspective(800px) rotateY(180deg);opacity:0} 100%{transform:perspective(800px) rotateY(0deg);opacity:1}}@keyframes rotate-out{ 0%{transform:perspective(800px) rotateY(0deg);opacity:1} 100%{transform:perspective(800px) rotateY(-180deg);opacity:0}}', '', function(opts) {
    var self = this;
    this.lock = false;
    this.stack = [];
    this.animationMap = {
      item: {
        name: 'scale',
      },
    };
    this.tagName = function(tagName) {
      return tagName || 'home';
    };

    this.on('mount', function() {

    });

    this.on('updated', function() {
      riot.route.start(true);
    });

    this.back = function() {
      self._back = true;
      history.back();
    };

    this.replace = function() {

    };

    var setAnimation = function(elm, name, duration, direction) {
      elm.style.animationDuration = duration || '';
      elm.style.animationDirection = direction || '';
      elm.style.animationName = name || '';
    };

    var onceEvent = function(elm, evtName, fn) {
      var temp = function() {
        elm.removeEventListener(evtName, temp, false);
        fn();
      };
      elm.addEventListener(evtName, temp, false);
    };

    this._swap = function(next, prev, back, done) {

      var animation = (back !== true) ? next._tag.animation : prev._tag.animation;

      if (!animation || !animation.name) {
        done();
        return ;
      }

      var time = animation.time || 500;

      if (!back) {
        setAnimation(next, animation.name + '-in', time);
      }
      else {
        setAnimation(next, animation.name + '-out', time, 'reverse');
      }

      onceEvent(next, 'animationend', function() {
        setAnimation(next);
      });

      if (prev) {
        if (!back) {
          setAnimation(prev, animation.name + '-out', time);
        }
        else {
          setAnimation(prev, animation.name + '-in', time, 'reverse');
        }

        onceEvent(prev, 'animationend', function() {
          setAnimation(prev);
          done();
        });
      }
      else {
        done();
      }
    };

    riot.route(function(tagName) {
      tagName = self.tagName.apply(self, arguments);

      var prev = self.currentContent;

      var e = {
        prevTag: prev ? prev._tag : null,
        opts: riot.spat.opts || {},
        hashes: location.hash.split('?')[0].split('/'),
        query: riot.route.query(),
        args: Array.prototype.slice.call(arguments),
        back: self._back,
      };

      if (prev && prev.getAttribute('riot-tag') === tagName) {
        prev._tag.trigger('active', e);
        return ;
      }

      var content = self.root.getElementsByTagName(tagName)[0];
      if (!content) {
        content = document.createElement(tagName);
        content.classList.add('spat-content');
        self.contents.appendChild(content);
        riot.mount(tagName, tagName, {
          app: self,
        });
      }
      else {
        if (!self._back) {

          var parent = content.parentNode;
          parent.removeChild(content);
          parent.appendChild(content);
        }
      }

      if (prev) {
        prev._tag.trigger('hide', e);
      }

      content._tag.trigger('active', e);

      self.lock = true;
      self.update();

      self._swap(content, prev, self._back, function() {
        if (prev) {
          if (prev._tag.cache !== false) {
            prev.classList.add('spat-hide');
          }
          else {
            var parent = prev.parentNode;
            parent.removeChild(prev);
          }
        }

        self.lock = false;
        self.update();
      });

      self.trigger('swap', {
        next: content,
        prev: prev,
        back: self._back,
      });

      content.classList.remove('spat-hide');
      self._back = false;

      self.prev = prev;
      self.currentContent = content;
      self.stack.push(prev);

      delete riot.spat.opts;
    });

    riot.spat = {
      goto: function(e, opts) {
        var path = '';
        if (typeof e === 'string') {
          path = e;
        }
        else {
          path = e.currentTarget.getAttribute('href');
        }
        riot.spat.opts = opts;
        riot.route(path);
      },
      back: function(index, opts) {
        self._back = true;

        riot.spat.opts = opts;
        if (typeof index === 'number') {
          history.go(-index);
        }
        else {
          history.back();
        }
      },
    };
});