
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
};

riot.tag2('spat-modal', '', 'spat-modal,[data-is="spat-modal"]{position:fixed;transform:translate3d(0, 0, 0);top:0;right:0;bottom:0;left:0;display:block;z-index:9999} spat-modal modal-content,[data-is="spat-modal"] modal-content{position:absolute;display:block;left:0;right:0;top:0;bottom:0}@keyframes modal-left-in{ 0%{transform:translateX(-200px);opacity:0} 100%{transform:translateX(0);opacity:1}}@keyframes modal-left-out{ 0%{transform:translateX(0);opacity:1} 100%{transform:translateX(-200px);opacity:0}}@keyframes modal-right-in{ 0%{transform:translateX(200px);opacity:0} 100%{transform:translateX(0);opacity:1}}@keyframes modal-right-out{ 0%{transform:translateX(0);opacity:1} 100%{transform:translateX(200px);opacity:0}}@keyframes modal-scale-in{ 0%{transform:scale(1.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes modal-scale-out{ 0%{transform:scale(1);opacity:1} 100%{transform:scale(.5);opacity:0}}', 'show="{visible}"', function(opts) {
    var self = this;

    this.open = function(page, options) {
      var elm = document.createElement('modal-content');
      self.root.appendChild(elm);
      var tag = riot.mount(elm, page, options)[0];

      self._openModal(tag);

      tag.one('close', function() {
        self._closeModal(tag);
      });

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

    this.close = function() {
      var content = this.root.querySelector('modal-content');
      if (!content) {
        self.visible = false;
      }
      self.update();
    };

    this._openModal = function(modal) {
      var modalElm = modal.refs.modal;
      modalElm.classList.add('show');
      modalElm.style.animationPlayState = 'running';

      onceEvent(modalElm, 'animationend', function(e) {
        modalElm.style.animationPlayState = 'paused';
      });
    };

    this._closeModal = function(modal) {
      var modalElm = modal.refs.modal;
      modalElm.classList.add('hide');
      modalElm.style.animationPlayState = 'running';

      onceEvent(modalElm, 'animationend', function(e) {
        modal.unmount();
        self.close();
      });
    };

    window.spat.modal = this;

    var onceEvent = function(elm, evtName, fn) {
      var temp = function() {
        elm.removeEventListener(evtName, temp, false);
        fn();
      };
      elm.addEventListener(evtName, temp, false);
    };

    riot.modal = {
      open: this.open,
      alert: function(text, title) {
        return self.open('modal-alert', {
          text: text,
          title: title,
        });
      },
      confirm: function(text, title) {
        return self.open('modal-confirm', {
          text: text,
          title: title,
        });
      },
      indicator: function(text, title) {
        return self.open('modal-indicator');
      },
    };
});

riot.tag2('spat-nav', '<div ref="pages" class="spat-pages"></div> <div if="{_locked}" ref="lock" class="spat-lock"></div>', 'spat-nav,[data-is="spat-nav"]{position:relative;display:block;width:100%;height:100%} spat-nav .spat-pages,[data-is="spat-nav"] .spat-pages{position:absolute;width:100%;height:100%} spat-nav .spat-pages .spat-page,[data-is="spat-nav"] .spat-pages .spat-page{position:absolute;width:100%;height:100%;backface-visibility:hidden;animation-fill-mode:forwards;overflow:scroll} spat-nav .spat-pages .spat-page.spat-hide,[data-is="spat-nav"] .spat-pages .spat-page.spat-hide{display:none} spat-nav .spat-lock,[data-is="spat-nav"] .spat-lock{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background-color:transparent}@keyframes slide-in{ 0%{transform:translate(250px, 0);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes slide-out{ 0%{opacity:1} 100%{opacity:.8}}@keyframes scale-in{ 0%{transform:scale(.5);opacity:0} 0%{transform:scale(.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes scale-out{ 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0}}@keyframes rotate-in{ 0%{transform:perspective(800px) rotateY(180deg);opacity:0} 100%{transform:perspective(800px) rotateY(0deg);opacity:1}}@keyframes rotate-out{ 0%{transform:perspective(800px) rotateY(0deg);opacity:1} 100%{transform:perspective(800px) rotateY(-180deg);opacity:0}}', '', function(opts) {
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

    this.swap = function(tagName) {
      var prevPage = this.currentPage;

      var page = this.refs.pages.querySelector('[data-is=' + tagName + ']');

      if(!page) {
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
        opts: spat.nav.opts || {},
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

      spat.nav.opts = opts;
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

    window.spat = window.spat || {};
    window.spat.nav = this;

    var swapAnimation = function(next, prev, back) {
      var animation = (back !== true) ? next._tag.animation : prev._tag.animation;

      if (!animation || !animation.name) {
        return Promise.resolve();
      }

      if (!back) {
        var direction = '';
        var nextAnimation = animation.name + '-in';
        var prevAnimation = animation.name + '-out'
        var duration = '256ms';
      }
      else {
        var direction = 'reverse';
        var nextAnimation = animation.name + '-out';
        var prevAnimation = animation.name + '-in'
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

riot.tag2('spat-scroll-loader', '<span>loading...</span>', 'spat-scroll-loader,[data-is="spat-scroll-loader"]{display:flex;justify-content:center;align-items:center;height:44px} spat-scroll-loader [class^=icon],[data-is="spat-scroll-loader"] [class^=icon]{display:block;font-size:22px}@keyframes scroll-loader-spin{ from{transform:rotate(0deg)} to{transform:rotate(360deg)}}', 'if="{show}"', function(opts) {
    var self = this;

    this.init = function() {
      this.page = 0;
      this.show = true;
      this.lock = false;

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

      this.load();
    });

    this.load = function() {
      if (this.lock === true) return ;

      this.lock = true;
      var d = opts.onload(++this.page);
      d.done(function(res) {
        self.lock = false;
        self.update();
      });
    };
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