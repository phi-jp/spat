/* 
 * spat 0.0.1
 * single page application framework for riot.js
 * MIT Licensed
 * 
 * Copyright (C) 2016 phi, http://phiary.me
 */


'use strict';


riot.tag2('spat-nav', '<div name="contents" class="spat-contents"></div>', 'spat-nav .spat-content,[riot-tag="spat-nav"] .spat-content,[data-is="spat-nav"] .spat-content{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch;backface-visibility:hidden;z-index:5;animation-duration:500ms;display:none} spat-nav .spat-content.active,[riot-tag="spat-nav"] .spat-content.active,[data-is="spat-nav"] .spat-content.active{display:block}@keyframes slide-in{ 0%{transform:translate(250px, 0);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes scale-in{ 0%{transform:scale(.5);opacity:0} 0%{transform:scale(.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes scale-out{ 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0}}@keyframes rotate-in{ 0%{transform:perspective(800px) rotateY(180deg);opacity:0} 100%{transform:perspective(800px) rotateY(0deg);opacity:1}}@keyframes rotate-out{ 0%{transform:perspective(800px) rotateY(0deg);opacity:1} 100%{transform:perspective(800px) rotateY(-180deg);opacity:0}}', '', function(opts) {
    var self = this;
    this.stack = [];
    this.animationMap = {
      item: {
        name: 'scale',
      },
    };

    this.on('mount', function() {
    });

    this.on('updated', function() {
      riot.route.start(true);
    });

    this.back = function() {
      self._back = true;
      var content = self.stack.pop();
      location.hash = content.localName;

    };

    this.replace = function() {

    };

    this._swap = function(next, prev, back, done) {

      var animation = (back !== true) ? next._tag.animation : prev._tag.animation;

      if (!animation) {
        done();
        return ;
      }

      var time = animation.time || 500;

      next.style.animationDuration = animation.time;
      if (!back) {
        next.style.animationName = animation.name + '-in';
      }
      else {
        next.style.animationDirection = 'reverse';
        next.style.animationName = animation.name + '-out';
      }
      setTimeout(function() {
        next.style.animationDuration = '';
        next.style.animationDirection = '';
        next.style.animationName = '';
      }, time);

      if (prev) {
        prev.style.animationDuration = animation.time;

        if (!back) {

          prev.style.animationName = animation.name + '-out';
        }
        else {
          prev.style.animationDirection = 'reverse';
          prev.style.animationName = animation.name + '-in';
        }
        setTimeout(function() {
          prev.style.animationDuration = '';
          prev.style.animationDirection = '';
          prev.style.animationName = '';
          prev.style.zIndex = '';
          done();
        }, time);
      }
    };

    riot.route(function(tagName) {
      if (tagName === '') tagName = 'home';

      var prev = self.contents.querySelector('.active');
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

      content.classList.add('active');

      content._tag.trigger('active');

      self._swap(content, prev, self._back, function() {
        if (prev) {
          prev.classList.remove('active');
        }
      });

      self.trigger('swap', {
        next: content,
        prev: prev,
        back: self._back,
        done: function() {
          if (prev) {
            prev.classList.remove('active');
          }
        },
      });

      self._back = false;

      self.prev = prev;
      self.stack.push(prev);
    });
});