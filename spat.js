/* 
 * spat 0.0.1
 * single page application framework for riot.js
 * MIT Licensed
 * 
 * Copyright (C) 2016 phi, http://phiary.me
 */


'use strict';


riot.tag2('spat-nav', '<div name="contents" class="spat-contents"></div> <div if="{lock}" class="spat-lock"></div>', 'spat-nav,[riot-tag="spat-nav"],[data-is="spat-nav"]{display:block;width:100%;height:100%} spat-nav .spat-content,[riot-tag="spat-nav"] .spat-content,[data-is="spat-nav"] .spat-content{position:absolute;top:0;right:0;bottom:0;left:0;display:block;width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch;backface-visibility:hidden;z-index:5;animation-duration:300ms;animation-timing-function:ease-in-out} spat-nav .spat-content.spat-hide,[riot-tag="spat-nav"] .spat-content.spat-hide,[data-is="spat-nav"] .spat-content.spat-hide{display:none} spat-nav .spat-lock,[riot-tag="spat-nav"] .spat-lock,[data-is="spat-nav"] .spat-lock{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background-color:rgba(255,0,0,0.2);background-color:transparent}@keyframes slide-in{ 0%{transform:translate(250px, 0);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes slide-out{ 0%{opacity:1} 100%{opacity:.8}}@keyframes scale-in{ 0%{transform:scale(.5);opacity:0} 0%{transform:scale(.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes scale-out{ 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0}}@keyframes rotate-in{ 0%{transform:perspective(800px) rotateY(180deg);opacity:0} 100%{transform:perspective(800px) rotateY(0deg);opacity:1}}@keyframes rotate-out{ 0%{transform:perspective(800px) rotateY(0deg);opacity:1} 100%{transform:perspective(800px) rotateY(-180deg);opacity:0}}', '', function(opts) {
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