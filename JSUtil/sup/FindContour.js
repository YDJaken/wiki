function t(t,n,r){t=+t,n=+n,r=(i=arguments.length)<2?(n=t,t=0,1):i<3?1:+r;let e=-1,i=0|Math.max(0,Math.ceil((n-t)/r)),o=new Array(i);for(;++e<i;)o[e]=t+e*r;return o}const n=Math.sqrt(50),r=Math.sqrt(10),e=Math.sqrt(2);function i(t,i,o){let a=Math.abs(i-t)/Math.max(0,o),h=Math.pow(10,Math.floor(Math.log(a)/Math.LN10)),f=a/h;return f>=n?h*=10:f>=r?h*=5:f>=e&&(h*=2),i<t?-h:h}function o(t){return Math.ceil(Math.log(t.length)/Math.LN2)+1}function a(t,n){return t-n}function h(t){return function(){return t}}function f(t,n){let r,e=-1,i=n.length;for(;++e<i;)if(r=u(t,n[e]))return r;return 0}function u(t,n){let r=n[0],e=n[1],i=-1;for(let o=0,a=t.length,h=a-1;o<a;h=o++){let a=t[o],f=a[0],u=a[1],c=t[h],d=c[0],s=c[1];if(l(a,c,n))return 0;u>e!=s>e&&r<(d-f)*(e-u)/(s-u)+f&&(i=-i)}return i}function l(t,n,r){let e;return function(t,n,r){return(n[0]-t[0])*(r[1]-t[1])==(r[0]-t[0])*(n[1]-t[1])}(t,n,r)&&(i=t[e=+(t[0]===n[0])],o=r[e],a=n[e],i<=o&&o<=a||a<=o&&o<=i);var i,o,a}function c(){}const d=Array.prototype.slice,s=[[],[[[1,1.5],[.5,1]]],[[[1.5,1],[1,1.5]]],[[[1.5,1],[.5,1]]],[[[1,.5],[1.5,1]]],[[[1,1.5],[.5,1]],[[1,.5],[1.5,1]]],[[[1,.5],[1,1.5]]],[[[1,.5],[.5,1]]],[[[.5,1],[1,.5]]],[[[1,1.5],[1,.5]]],[[[.5,1],[1,.5]],[[1.5,1],[1,1.5]]],[[[1.5,1],[1,.5]]],[[[.5,1],[1.5,1]]],[[[1,1.5],[1.5,1]]],[[[.5,1],[1,1.5]]],[]];function g(){let n=1,r=1,e=o,u=M;function l(n){let r=e(n);if(Array.isArray(r))r=r.slice().sort(a);else{let e=function(t,n){let r,e,i,o=t.length,a=-1;if(null==n){for(;++a<o;)if(null!=(r=t[a])&&r>=r)for(e=i=r;++a<o;)null!=(r=t[a])&&(e>r&&(e=r),i<r&&(i=r))}else for(;++a<o;)if(null!=(r=n(t[a],a,t))&&r>=r)for(e=i=r;++a<o;)null!=(r=n(t[a],a,t))&&(e>r&&(e=r),i<r&&(i=r));return[e,i]}(n),o=e[0],a=e[1];r=i(o,a,r),r=t(Math.floor(o/r)*r,Math.floor(a/r)*r,r)}return r.map((function(t){return g(n,t)}))}function g(t,e){let i=[],o=[];return function(t,e,i){let o,a,h,f,u,l,c=[],d=[];o=a=-1,f=t[0]>=e,s[f<<1].forEach(g);for(;++o<n-1;)h=f,f=t[o+1]>=e,s[h|f<<1].forEach(g);s[f<<0].forEach(g);for(;++a<r-1;){for(o=-1,f=t[a*n+n]>=e,u=t[a*n]>=e,s[f<<1|u<<2].forEach(g);++o<n-1;)h=f,f=t[a*n+n+o+1]>=e,l=u,u=t[a*n+o+1]>=e,s[h|f<<1|u<<2|l<<3].forEach(g);s[f|u<<3].forEach(g)}o=-1,u=t[a*n]>=e,s[u<<2].forEach(g);for(;++o<n-1;)l=u,u=t[a*n+o+1]>=e,s[u<<2|l<<3].forEach(g);function g(t){let n,r,e=[t[0][0]+o,t[0][1]+a],h=[t[1][0]+o,t[1][1]+a],f=w(e),u=w(h);(n=d[f])?(r=c[u])?(delete d[n.end],delete c[r.start],n===r?(n.ring.push(h),i(n.ring)):c[n.start]=d[r.end]={start:n.start,end:r.end,ring:n.ring.concat(r.ring)}):(delete d[n.end],n.ring.push(h),d[n.end=u]=n):(n=c[u])?(r=d[f])?(delete c[n.start],delete d[r.end],n===r?(n.ring.push(h),i(n.ring)):c[r.start]=d[n.end]={start:r.start,end:n.end,ring:r.ring.concat(n.ring)}):(delete c[n.start],n.ring.unshift(e),c[n.start=f]=n):c[f]=d[u]={start:f,end:u,ring:[e,h]}}s[u<<3].forEach(g)}(t,e,(function(n){u(n,t,e),function(t){let n=0,r=t.length,e=t[r-1][1]*t[0][0]-t[r-1][0]*t[0][1];for(;++n<r;)e+=t[n-1][1]*t[n][0]-t[n-1][0]*t[n][1];return e}(n)>0?i.push([n]):o.push(n)})),o.forEach((function(t){for(var n,r=0,e=i.length;r<e;++r)if(-1!==f((n=i[r])[0],t))return void n.push(t)})),{value:e,arrays:i}}function w(t){return 2*t[0]+t[1]*(n+1)*4}function M(t,e,i){t.forEach((function(t){var o,a=t[0],h=t[1],f=0|a,u=0|h,l=e[u*n+f];a>0&&a<n&&f===a&&(o=e[u*n+f-1],t[0]=a+(i-o)/(l-o)-.5),h>0&&h<r&&u===h&&(o=e[(u-1)*n+f],t[1]=h+(i-o)/(l-o)-.5)}))}return l.contour=g,l.size=function(t){if(!arguments.length)return[n,r];let e=Math.ceil(t[0]),i=Math.ceil(t[1]);if(!(e>0&&i>0))throw new Error("invalid size");return n=e,r=i,l},l.thresholds=function(t){return arguments.length?(e="function"==typeof t?t:Array.isArray(t)?h(d.call(t)):h(t),l):e},l.smooth=function(t){return arguments.length?(u=t?M:c,l):u===M},l}function w(t,n,r){for(var e=t.width,i=t.height,o=1+(r<<1),a=0;a<i;++a)for(var h=0,f=0;h<e+r;++h)h<e&&(f+=t.data[h+a*e]),h>=r&&(h>=o&&(f-=t.data[h-o+a*e]),n.data[h-r+a*e]=f/Math.min(h+1,e-1+o-h,o))}function M(t,n,r){for(var e=t.width,i=t.height,o=1+(r<<1),a=0;a<e;++a)for(var h=0,f=0;h<i+r;++h)h<i&&(f+=t.data[a+h*e]),h>=r&&(h>=o&&(f-=t.data[a+(h-o)*e]),n.data[a+(h-r)*e]=f/Math.min(h+1,i-1+o-h,o))}const y=Array.prototype.slice;function p(t){return t[0]}function v(t){return t[1]}function E(){return 1}function A(){var n=p,r=v,e=E,o=960,a=500,f=20,u=2,l=3*f,c=o+2*l>>u,d=a+2*l>>u,s=h(20);function A(o){var a=new Float32Array(c*d),h=new Float32Array(c*d);o.forEach((function(t,i,o){var h=+n(t,i,o)+l>>u,f=+r(t,i,o)+l>>u,s=+e(t,i,o);h>=0&&h<c&&f>=0&&f<d&&(a[h+f*c]+=s)})),w({width:c,height:d,data:a},{width:c,height:d,data:h},f>>u),M({width:c,height:d,data:h},{width:c,height:d,data:a},f>>u),w({width:c,height:d,data:a},{width:c,height:d,data:h},f>>u),M({width:c,height:d,data:h},{width:c,height:d,data:a},f>>u),w({width:c,height:d,data:a},{width:c,height:d,data:h},f>>u),M({width:c,height:d,data:h},{width:c,height:d,data:a},f>>u);var y=s(a);if(!Array.isArray(y)){var p=function(t,n){let r,e,i=t.length,o=-1;if(null==n){for(;++o<i;)if(null!=(r=t[o])&&r>=r)for(e=r;++o<i;)null!=(r=t[o])&&r>e&&(e=r)}else for(;++o<i;)if(null!=(r=n(t[o],o,t))&&r>=r)for(e=r;++o<i;)null!=(r=n(t[o],o,t))&&r>e&&(e=r);return e}(a);y=i(0,p,y),(y=t(0,Math.floor(p/y)*y,y)).shift()}return g().thresholds(y).size([c,d])(a).map(m)}function m(t){return t.value*=Math.pow(2,-2*u),t.coordinates.forEach(z),t}function z(t){t.forEach(q)}function q(t){t.forEach(x)}function x(t){t[0]=t[0]*Math.pow(2,u)-l,t[1]=t[1]*Math.pow(2,u)-l}function b(){return c=o+2*(l=3*f)>>u,d=a+2*l>>u,A}return A.x=function(t){return arguments.length?(n="function"==typeof t?t:h(+t),A):n},A.y=function(t){return arguments.length?(r="function"==typeof t?t:h(+t),A):r},A.weight=function(t){return arguments.length?(e="function"==typeof t?t:h(+t),A):e},A.size=function(t){if(!arguments.length)return[o,a];var n=Math.ceil(t[0]),r=Math.ceil(t[1]);if(!(n>=0||n>=0))throw new Error("invalid size");return o=n,a=r,b()},A.cellSize=function(t){if(!arguments.length)return 1<<u;if(!((t=+t)>=1))throw new Error("invalid cell size");return u=Math.floor(Math.log(t)/Math.LN2),b()},A.thresholds=function(t){return arguments.length?(s="function"==typeof t?t:Array.isArray(t)?h(y.call(t)):h(t),A):s},A.bandwidth=function(t){if(!arguments.length)return Math.sqrt(f*(f+1));if(!((t=+t)>=0))throw new Error("invalid bandwidth");return f=Math.round((Math.sqrt(4*t*t+1)-1)/2),b()},A}export{A as contourDensity,g as contours,t as range};