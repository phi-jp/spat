
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
};

riot.tag2('spat-modal', '', '', '', function(opts) {
});

riot.tag2('spat-nav', '<div ref="pages" class="spat-pages"></div> <div if="{_locked}" ref="lock" class="spat-lock"></div>', 'spat-nav,[data-is="spat-nav"]{position:relative;display:block;width:100%;height:100%} spat-nav .spat-pages,[data-is="spat-nav"] .spat-pages{position:absolute;width:100%;height:100%} spat-nav .spat-pages .spat-page,[data-is="spat-nav"] .spat-pages .spat-page{position:absolute;width:100%;height:100%;backface-visibility:hidden;animation-fill-mode:forwards;overflow:scroll} spat-nav .spat-pages .spat-page.spat-hide,[data-is="spat-nav"] .spat-pages .spat-page.spat-hide{display:none} spat-nav .spat-lock,[data-is="spat-nav"] .spat-lock{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background-color:transparent}@keyframes slide-in{ 0%{transform:translate(250px, 0);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes slide-out{ 0%{opacity:1} 100%{opacity:.8}}@keyframes scale-in{ 0%{transform:scale(.5);opacity:0} 0%{transform:scale(.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes scale-out{ 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0}}@keyframes rotate-in{ 0%{transform:perspective(800px) rotateY(180deg);opacity:0} 100%{transform:perspective(800px) rotateY(0deg);opacity:1}}@keyframes rotate-out{ 0%{transform:perspective(800px) rotateY(0deg);opacity:1} 100%{transform:perspective(800px) rotateY(-180deg);opacity:0}}', '', function(opts) {
    var self = this;

    this._back = false;
    this._locked = false;

    this.tagName = function(tagName) {
      return tagName || 'home';
    };

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
      tagName = self.tagName.apply(self, arguments);

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

    this.on('mount', function() {
      route.start(true);
    });

    route(function(tagName) {
      self.swap.apply(self, arguments);
    });

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