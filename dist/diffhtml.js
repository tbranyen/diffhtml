(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diffhtml = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var __cov_fQKTPCYX9$7CNUxOtm3NaA = (Function('return this'))();
if (!__cov_fQKTPCYX9$7CNUxOtm3NaA.__coverage__) { __cov_fQKTPCYX9$7CNUxOtm3NaA.__coverage__ = {}; }
__cov_fQKTPCYX9$7CNUxOtm3NaA = __cov_fQKTPCYX9$7CNUxOtm3NaA.__coverage__;
if (!(__cov_fQKTPCYX9$7CNUxOtm3NaA['/home/tim/git/diffhtml/lib/index.js'])) {
   __cov_fQKTPCYX9$7CNUxOtm3NaA['/home/tim/git/diffhtml/lib/index.js'] = {"path":"/home/tim/git/diffhtml/lib/index.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":1,"7":0,"8":0,"9":0,"10":1,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":1,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":1,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0],"8":[0,0],"9":[0,0],"10":[0,0],"11":[0,0],"12":[0,0],"13":[0,0],"14":[0,0],"15":[0,0],"16":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"parseHTML","line":8,"loc":{"start":{"line":8,"column":0},"end":{"line":8,"column":27}}},"2":{"name":"parseElement","line":18,"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":28}}},"3":{"name":"(anonymous_3)","line":33,"loc":{"start":{"line":33,"column":38},"end":{"line":33,"column":52}}},"4":{"name":"html2hscript","line":50,"loc":{"start":{"line":50,"column":0},"end":{"line":50,"column":30}}},"5":{"name":"getPatches","line":68,"loc":{"start":{"line":68,"column":0},"end":{"line":68,"column":38}}},"6":{"name":"(anonymous_6)","line":97,"loc":{"start":{"line":97,"column":7},"end":{"line":97,"column":25}}},"7":{"name":"(anonymous_7)","line":126,"loc":{"start":{"line":126,"column":7},"end":{"line":126,"column":25}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":1,"column":40}},"2":{"start":{"line":2,"column":0},"end":{"line":2,"column":46}},"3":{"start":{"line":3,"column":0},"end":{"line":3,"column":45}},"4":{"start":{"line":5,"column":0},"end":{"line":5,"column":47}},"5":{"start":{"line":6,"column":0},"end":{"line":6,"column":29}},"6":{"start":{"line":8,"column":0},"end":{"line":16,"column":1}},"7":{"start":{"line":9,"column":2},"end":{"line":9,"column":56}},"8":{"start":{"line":12,"column":2},"end":{"line":13,"column":46}},"9":{"start":{"line":15,"column":2},"end":{"line":15,"column":29}},"10":{"start":{"line":18,"column":0},"end":{"line":48,"column":1}},"11":{"start":{"line":19,"column":2},"end":{"line":19,"column":52}},"12":{"start":{"line":20,"column":2},"end":{"line":20,"column":37}},"13":{"start":{"line":22,"column":2},"end":{"line":24,"column":3}},"14":{"start":{"line":23,"column":4},"end":{"line":23,"column":37}},"15":{"start":{"line":26,"column":2},"end":{"line":39,"column":3}},"16":{"start":{"line":27,"column":4},"end":{"line":27,"column":33}},"17":{"start":{"line":28,"column":4},"end":{"line":28,"column":33}},"18":{"start":{"line":29,"column":4},"end":{"line":29,"column":30}},"19":{"start":{"line":31,"column":4},"end":{"line":31,"column":30}},"20":{"start":{"line":33,"column":4},"end":{"line":38,"column":7}},"21":{"start":{"line":34,"column":6},"end":{"line":37,"column":7}},"22":{"start":{"line":35,"column":8},"end":{"line":35,"column":63}},"23":{"start":{"line":36,"column":8},"end":{"line":36,"column":33}},"24":{"start":{"line":41,"column":2},"end":{"line":41,"column":62}},"25":{"start":{"line":43,"column":2},"end":{"line":45,"column":3}},"26":{"start":{"line":44,"column":4},"end":{"line":44,"column":69}},"27":{"start":{"line":47,"column":2},"end":{"line":47,"column":53}},"28":{"start":{"line":50,"column":0},"end":{"line":66,"column":1}},"29":{"start":{"line":51,"column":2},"end":{"line":51,"column":53}},"30":{"start":{"line":53,"column":2},"end":{"line":55,"column":3}},"31":{"start":{"line":54,"column":4},"end":{"line":54,"column":16}},"32":{"start":{"line":57,"column":2},"end":{"line":63,"column":3}},"33":{"start":{"line":58,"column":4},"end":{"line":60,"column":5}},"34":{"start":{"line":59,"column":6},"end":{"line":59,"column":48}},"35":{"start":{"line":62,"column":4},"end":{"line":62,"column":23}},"36":{"start":{"line":65,"column":2},"end":{"line":65,"column":51}},"37":{"start":{"line":68,"column":0},"end":{"line":92,"column":1}},"38":{"start":{"line":69,"column":2},"end":{"line":71,"column":3}},"39":{"start":{"line":70,"column":4},"end":{"line":70,"column":72}},"40":{"start":{"line":73,"column":2},"end":{"line":73,"column":35}},"41":{"start":{"line":74,"column":2},"end":{"line":74,"column":54}},"42":{"start":{"line":76,"column":2},"end":{"line":82,"column":3}},"43":{"start":{"line":77,"column":4},"end":{"line":77,"column":79}},"44":{"start":{"line":78,"column":4},"end":{"line":78,"column":37}},"45":{"start":{"line":79,"column":4},"end":{"line":79,"column":56}},"46":{"start":{"line":81,"column":4},"end":{"line":81,"column":41}},"47":{"start":{"line":84,"column":2},"end":{"line":84,"column":40}},"48":{"start":{"line":85,"column":2},"end":{"line":85,"column":53}},"49":{"start":{"line":87,"column":2},"end":{"line":87,"column":27}},"50":{"start":{"line":87,"column":18},"end":{"line":87,"column":25}},"51":{"start":{"line":89,"column":2},"end":{"line":89,"column":23}},"52":{"start":{"line":91,"column":2},"end":{"line":91,"column":17}},"53":{"start":{"line":94,"column":0},"end":{"line":118,"column":3}},"54":{"start":{"line":98,"column":4},"end":{"line":101,"column":5}},"55":{"start":{"line":99,"column":6},"end":{"line":99,"column":26}},"56":{"start":{"line":100,"column":6},"end":{"line":100,"column":13}},"57":{"start":{"line":103,"column":4},"end":{"line":103,"column":55}},"58":{"start":{"line":105,"column":4},"end":{"line":105,"column":39}},"59":{"start":{"line":107,"column":4},"end":{"line":110,"column":5}},"60":{"start":{"line":108,"column":6},"end":{"line":108,"column":52}},"61":{"start":{"line":109,"column":6},"end":{"line":109,"column":38}},"62":{"start":{"line":112,"column":4},"end":{"line":114,"column":5}},"63":{"start":{"line":113,"column":6},"end":{"line":113,"column":43}},"64":{"start":{"line":116,"column":4},"end":{"line":116,"column":45}},"65":{"start":{"line":120,"column":0},"end":{"line":121,"column":66}},"66":{"start":{"line":123,"column":0},"end":{"line":130,"column":3}},"67":{"start":{"line":127,"column":4},"end":{"line":127,"column":49}},"68":{"start":{"line":128,"column":4},"end":{"line":128,"column":36}}},"branchMap":{"1":{"line":12,"type":"cond-expr","locations":[{"start":{"line":13,"column":4},"end":{"line":13,"column":23}},{"start":{"line":13,"column":26},"end":{"line":13,"column":45}}]},"2":{"line":22,"type":"if","locations":[{"start":{"line":22,"column":2},"end":{"line":22,"column":2}},{"start":{"line":22,"column":2},"end":{"line":22,"column":2}}]},"3":{"line":26,"type":"if","locations":[{"start":{"line":26,"column":2},"end":{"line":26,"column":2}},{"start":{"line":26,"column":2},"end":{"line":26,"column":2}}]},"4":{"line":34,"type":"if","locations":[{"start":{"line":34,"column":6},"end":{"line":34,"column":6}},{"start":{"line":34,"column":6},"end":{"line":34,"column":6}}]},"5":{"line":41,"type":"cond-expr","locations":[{"start":{"line":41,"column":25},"end":{"line":41,"column":53}},{"start":{"line":41,"column":56},"end":{"line":41,"column":60}}]},"6":{"line":43,"type":"if","locations":[{"start":{"line":43,"column":2},"end":{"line":43,"column":2}},{"start":{"line":43,"column":2},"end":{"line":43,"column":2}}]},"7":{"line":53,"type":"if","locations":[{"start":{"line":53,"column":2},"end":{"line":53,"column":2}},{"start":{"line":53,"column":2},"end":{"line":53,"column":2}}]},"8":{"line":57,"type":"if","locations":[{"start":{"line":57,"column":2},"end":{"line":57,"column":2}},{"start":{"line":57,"column":2},"end":{"line":57,"column":2}}]},"9":{"line":58,"type":"if","locations":[{"start":{"line":58,"column":4},"end":{"line":58,"column":4}},{"start":{"line":58,"column":4},"end":{"line":58,"column":4}}]},"10":{"line":69,"type":"if","locations":[{"start":{"line":69,"column":2},"end":{"line":69,"column":2}},{"start":{"line":69,"column":2},"end":{"line":69,"column":2}}]},"11":{"line":76,"type":"if","locations":[{"start":{"line":76,"column":2},"end":{"line":76,"column":2}},{"start":{"line":76,"column":2},"end":{"line":76,"column":2}}]},"12":{"line":77,"type":"binary-expr","locations":[{"start":{"line":77,"column":19},"end":{"line":77,"column":60}},{"start":{"line":77,"column":65},"end":{"line":77,"column":78}}]},"13":{"line":77,"type":"cond-expr","locations":[{"start":{"line":77,"column":29},"end":{"line":77,"column":43}},{"start":{"line":77,"column":46},"end":{"line":77,"column":60}}]},"14":{"line":87,"type":"if","locations":[{"start":{"line":87,"column":2},"end":{"line":87,"column":2}},{"start":{"line":87,"column":2},"end":{"line":87,"column":2}}]},"15":{"line":98,"type":"if","locations":[{"start":{"line":98,"column":4},"end":{"line":98,"column":4}},{"start":{"line":98,"column":4},"end":{"line":98,"column":4}}]},"16":{"line":107,"type":"if","locations":[{"start":{"line":107,"column":4},"end":{"line":107,"column":4}},{"start":{"line":107,"column":4},"end":{"line":107,"column":4}}]}}};
}
__cov_fQKTPCYX9$7CNUxOtm3NaA = __cov_fQKTPCYX9$7CNUxOtm3NaA['/home/tim/git/diffhtml/lib/index.js'];
__cov_fQKTPCYX9$7CNUxOtm3NaA.s['1']++;var virtualDom=require('virtual-dom');__cov_fQKTPCYX9$7CNUxOtm3NaA.s['2']++;var recurseNodes=require('./recurse-nodes');__cov_fQKTPCYX9$7CNUxOtm3NaA.s['3']++;var DOMParser=require('./util/dom-parser');__cov_fQKTPCYX9$7CNUxOtm3NaA.s['4']++;var namespace='http://www.w3.org/1999/xhtml';__cov_fQKTPCYX9$7CNUxOtm3NaA.s['5']++;var parser=new DOMParser();function parseHTML(markup){__cov_fQKTPCYX9$7CNUxOtm3NaA.f['1']++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['7']++;var doc=parser.parseFromString(markup,'text/html');__cov_fQKTPCYX9$7CNUxOtm3NaA.s['8']++;var nodes=markup.indexOf('<html')>-1?(__cov_fQKTPCYX9$7CNUxOtm3NaA.b['1'][0]++,doc.documentElement):(__cov_fQKTPCYX9$7CNUxOtm3NaA.b['1'][1]++,doc.body.childNodes);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['9']++;return recurseNodes(nodes);}function parseElement(elem){__cov_fQKTPCYX9$7CNUxOtm3NaA.f['2']++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['11']++;var hasAttribs=Object.keys(elem.attribs).length;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['12']++;var args=['"'+elem.name+'"'];__cov_fQKTPCYX9$7CNUxOtm3NaA.s['13']++;if(elem.name==='#text'){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['2'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['14']++;return JSON.stringify(elem.text);}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['2'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['15']++;if(hasAttribs){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['3'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['16']++;var old=elem.attribs.class;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['17']++;elem.attribs.className=old;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['18']++;delete elem.attribs.class;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['19']++;elem.attribs.dataset={};__cov_fQKTPCYX9$7CNUxOtm3NaA.s['20']++;Object.keys(elem.attribs).forEach(function(key){__cov_fQKTPCYX9$7CNUxOtm3NaA.f['3']++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['21']++;if(key.indexOf('data-')===0){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['4'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['22']++;elem.attribs.dataset[key.slice(5)]=elem.attribs[key];__cov_fQKTPCYX9$7CNUxOtm3NaA.s['23']++;delete elem.attribs[key];}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['4'][1]++;}});}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['3'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['24']++;args.push(hasAttribs?(__cov_fQKTPCYX9$7CNUxOtm3NaA.b['5'][0]++,JSON.stringify(elem.attribs)):(__cov_fQKTPCYX9$7CNUxOtm3NaA.b['5'][1]++,null));__cov_fQKTPCYX9$7CNUxOtm3NaA.s['25']++;if(elem.children){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['6'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['26']++;args.push('['+elem.children.map(parseElement).join(',')+']');}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['6'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['27']++;return'h('+args.filter(Boolean).join(',')+')';}function html2hscript(markup){__cov_fQKTPCYX9$7CNUxOtm3NaA.f['4']++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['29']++;var elements=parseHTML(markup).map(parseElement);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['30']++;if(!elements.length){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['7'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['31']++;return null;}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['7'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['32']++;if(elements.length===1){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['8'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['33']++;if(elements[0].slice(0,1)!=='h'){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['9'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['34']++;return'h("SPAN", ['+elements[0]+'])';}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['9'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['35']++;return elements[0];}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['8'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['36']++;return'h("DIV", ['+elements.join(', ')+'])';}function getPatches(newHTML,isInner){__cov_fQKTPCYX9$7CNUxOtm3NaA.f['5']++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['38']++;if(typeof newHTML!=='string'){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['10'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['39']++;throw new Error('Invalid type passed to diffHTML, expected String');}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['10'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['40']++;var newH=html2hscript(newHTML);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['41']++;var newRender=new Function('h','return '+newH);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['42']++;if(!this._tree){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['11'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['43']++;var oldHTML=(__cov_fQKTPCYX9$7CNUxOtm3NaA.b['12'][0]++,isInner?(__cov_fQKTPCYX9$7CNUxOtm3NaA.b['13'][0]++,this.innerHTML):(__cov_fQKTPCYX9$7CNUxOtm3NaA.b['13'][1]++,this.outerHTML))||(__cov_fQKTPCYX9$7CNUxOtm3NaA.b['12'][1]++,'<div></div>');__cov_fQKTPCYX9$7CNUxOtm3NaA.s['44']++;var oldH=html2hscript(oldHTML);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['45']++;var oldRender=new Function('h','return '+oldH);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['46']++;this._tree=oldRender(virtualDom.h);}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['11'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['47']++;var newTree=newRender(virtualDom.h);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['48']++;var patches=virtualDom.diff(this._tree,newTree);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['49']++;if(!newTree){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['14'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['50']++;return;}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['14'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['51']++;this._tree=newTree;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['52']++;return patches;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['53']++;Object.defineProperty(Element.prototype,'diffHTML',{configurable:true,set:function(newHTML){__cov_fQKTPCYX9$7CNUxOtm3NaA.f['6']++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['54']++;if(newHTML===''){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['15'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['55']++;this.innerHTML='';__cov_fQKTPCYX9$7CNUxOtm3NaA.s['56']++;return;}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['15'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['57']++;var patches=getPatches.call(this,newHTML,true);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['58']++;this._element=this.childNodes[0];__cov_fQKTPCYX9$7CNUxOtm3NaA.s['59']++;if(!this._element){__cov_fQKTPCYX9$7CNUxOtm3NaA.b['16'][0]++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['60']++;this._element=document.createElement('div');__cov_fQKTPCYX9$7CNUxOtm3NaA.s['61']++;this.appendChild(this._element);}else{__cov_fQKTPCYX9$7CNUxOtm3NaA.b['16'][1]++;}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['62']++;for(var i=1;i<this.childNodes.length;i++){__cov_fQKTPCYX9$7CNUxOtm3NaA.s['63']++;this.removeChild(this.childNodes[i]);}__cov_fQKTPCYX9$7CNUxOtm3NaA.s['64']++;virtualDom.patch(this._element,patches);}});__cov_fQKTPCYX9$7CNUxOtm3NaA.s['65']++;Object.defineProperty(Element.prototype,'innerDiffHTML',Object.getOwnPropertyDescriptor(Element.prototype,'diffHTML'));__cov_fQKTPCYX9$7CNUxOtm3NaA.s['66']++;Object.defineProperty(Element.prototype,'outerDiffHTML',{configurable:true,set:function(newHTML){__cov_fQKTPCYX9$7CNUxOtm3NaA.f['7']++;__cov_fQKTPCYX9$7CNUxOtm3NaA.s['67']++;var patches=getPatches.call(this,newHTML);__cov_fQKTPCYX9$7CNUxOtm3NaA.s['68']++;virtualDom.patch(this,patches);}});

},{"./recurse-nodes":2,"./util/dom-parser":3,"virtual-dom":8}],2:[function(require,module,exports){

var __cov_R2wLYTubw9a1iTSorT3hrQ = (Function('return this'))();
if (!__cov_R2wLYTubw9a1iTSorT3hrQ.__coverage__) { __cov_R2wLYTubw9a1iTSorT3hrQ.__coverage__ = {}; }
__cov_R2wLYTubw9a1iTSorT3hrQ = __cov_R2wLYTubw9a1iTSorT3hrQ.__coverage__;
if (!(__cov_R2wLYTubw9a1iTSorT3hrQ['/home/tim/git/diffhtml/lib/recurse-nodes.js'])) {
   __cov_R2wLYTubw9a1iTSorT3hrQ['/home/tim/git/diffhtml/lib/recurse-nodes.js'] = {"path":"/home/tim/git/diffhtml/lib/recurse-nodes.js","s":{"1":0,"2":1,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0],"8":[0,0],"9":[0,0]},"f":{"1":0,"2":0},"fnMap":{"1":{"name":"recurse","line":9,"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":31}}},"2":{"name":"(anonymous_2)","line":48,"loc":{"start":{"line":48,"column":17},"end":{"line":48,"column":33}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":7,"column":2}},"2":{"start":{"line":9,"column":0},"end":{"line":46,"column":1}},"3":{"start":{"line":10,"column":2},"end":{"line":10,"column":17}},"4":{"start":{"line":11,"column":2},"end":{"line":11,"column":31}},"5":{"start":{"line":12,"column":2},"end":{"line":12,"column":33}},"6":{"start":{"line":13,"column":2},"end":{"line":13,"column":35}},"7":{"start":{"line":15,"column":2},"end":{"line":15,"column":33}},"8":{"start":{"line":15,"column":24},"end":{"line":15,"column":31}},"9":{"start":{"line":17,"column":2},"end":{"line":25,"column":3}},"10":{"start":{"line":18,"column":4},"end":{"line":18,"column":25}},"11":{"start":{"line":20,"column":7},"end":{"line":25,"column":3}},"12":{"start":{"line":21,"column":4},"end":{"line":21,"column":26}},"13":{"start":{"line":24,"column":4},"end":{"line":24,"column":49}},"14":{"start":{"line":27,"column":2},"end":{"line":27,"column":43}},"15":{"start":{"line":27,"column":34},"end":{"line":27,"column":41}},"16":{"start":{"line":29,"column":2},"end":{"line":29,"column":24}},"17":{"start":{"line":30,"column":2},"end":{"line":30,"column":33}},"18":{"start":{"line":31,"column":2},"end":{"line":31,"column":21}},"19":{"start":{"line":33,"column":2},"end":{"line":35,"column":3}},"20":{"start":{"line":34,"column":4},"end":{"line":34,"column":17}},"21":{"start":{"line":37,"column":2},"end":{"line":37,"column":47}},"22":{"start":{"line":39,"column":2},"end":{"line":41,"column":3}},"23":{"start":{"line":40,"column":4},"end":{"line":40,"column":50}},"24":{"start":{"line":43,"column":2},"end":{"line":43,"column":46}},"25":{"start":{"line":45,"column":2},"end":{"line":45,"column":15}},"26":{"start":{"line":48,"column":0},"end":{"line":57,"column":2}},"27":{"start":{"line":49,"column":2},"end":{"line":54,"column":3}},"28":{"start":{"line":50,"column":4},"end":{"line":50,"column":36}},"29":{"start":{"line":53,"column":4},"end":{"line":53,"column":49}},"30":{"start":{"line":56,"column":2},"end":{"line":56,"column":66}}},"branchMap":{"1":{"line":15,"type":"if","locations":[{"start":{"line":15,"column":2},"end":{"line":15,"column":2}},{"start":{"line":15,"column":2},"end":{"line":15,"column":2}}]},"2":{"line":17,"type":"if","locations":[{"start":{"line":17,"column":2},"end":{"line":17,"column":2}},{"start":{"line":17,"column":2},"end":{"line":17,"column":2}}]},"3":{"line":20,"type":"if","locations":[{"start":{"line":20,"column":7},"end":{"line":20,"column":7}},{"start":{"line":20,"column":7},"end":{"line":20,"column":7}}]},"4":{"line":27,"type":"if","locations":[{"start":{"line":27,"column":2},"end":{"line":27,"column":2}},{"start":{"line":27,"column":2},"end":{"line":27,"column":2}}]},"5":{"line":30,"type":"binary-expr","locations":[{"start":{"line":30,"column":15},"end":{"line":30,"column":24}},{"start":{"line":30,"column":28},"end":{"line":30,"column":32}}]},"6":{"line":33,"type":"if","locations":[{"start":{"line":33,"column":2},"end":{"line":33,"column":2}},{"start":{"line":33,"column":2},"end":{"line":33,"column":2}}]},"7":{"line":37,"type":"binary-expr","locations":[{"start":{"line":37,"column":14},"end":{"line":37,"column":29}},{"start":{"line":37,"column":33},"end":{"line":37,"column":46}}]},"8":{"line":49,"type":"if","locations":[{"start":{"line":49,"column":2},"end":{"line":49,"column":2}},{"start":{"line":49,"column":2},"end":{"line":49,"column":2}}]},"9":{"line":49,"type":"binary-expr","locations":[{"start":{"line":49,"column":6},"end":{"line":49,"column":12}},{"start":{"line":49,"column":16},"end":{"line":49,"column":29}}]}}};
}
__cov_R2wLYTubw9a1iTSorT3hrQ = __cov_R2wLYTubw9a1iTSorT3hrQ['/home/tim/git/diffhtml/lib/recurse-nodes.js'];
__cov_R2wLYTubw9a1iTSorT3hrQ.s['1']++;var humanizeNodeType={1:'tag',2:'attribute',3:'text',4:'cdata',8:'comment'};function recurse(node,i,all){__cov_R2wLYTubw9a1iTSorT3hrQ.f['1']++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['3']++;var entry={};__cov_R2wLYTubw9a1iTSorT3hrQ.s['4']++;var nodeName=node.nodeName;__cov_R2wLYTubw9a1iTSorT3hrQ.s['5']++;var nodeValue=node.nodeValue;__cov_R2wLYTubw9a1iTSorT3hrQ.s['6']++;var childNodes=node.childNodes;__cov_R2wLYTubw9a1iTSorT3hrQ.s['7']++;if(!node.nodeType){__cov_R2wLYTubw9a1iTSorT3hrQ.b['1'][0]++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['8']++;return;}else{__cov_R2wLYTubw9a1iTSorT3hrQ.b['1'][1]++;}__cov_R2wLYTubw9a1iTSorT3hrQ.s['9']++;if(nodeName==='style'){__cov_R2wLYTubw9a1iTSorT3hrQ.b['2'][0]++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['10']++;entry.type='style';}else{__cov_R2wLYTubw9a1iTSorT3hrQ.b['2'][1]++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['11']++;if(nodeName==='script'){__cov_R2wLYTubw9a1iTSorT3hrQ.b['3'][0]++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['12']++;entry.type='script';}else{__cov_R2wLYTubw9a1iTSorT3hrQ.b['3'][1]++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['13']++;entry.type=humanizeNodeType[node.nodeType];}}__cov_R2wLYTubw9a1iTSorT3hrQ.s['14']++;if(entry.type==='comment'){__cov_R2wLYTubw9a1iTSorT3hrQ.b['4'][0]++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['15']++;return;}else{__cov_R2wLYTubw9a1iTSorT3hrQ.b['4'][1]++;}__cov_R2wLYTubw9a1iTSorT3hrQ.s['16']++;entry.name=nodeName;__cov_R2wLYTubw9a1iTSorT3hrQ.s['17']++;entry.text=(__cov_R2wLYTubw9a1iTSorT3hrQ.b['5'][0]++,nodeValue)||(__cov_R2wLYTubw9a1iTSorT3hrQ.b['5'][1]++,null);__cov_R2wLYTubw9a1iTSorT3hrQ.s['18']++;entry.attribs={};__cov_R2wLYTubw9a1iTSorT3hrQ.s['19']++;if(entry.type==='text'){__cov_R2wLYTubw9a1iTSorT3hrQ.b['6'][0]++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['20']++;return entry;}else{__cov_R2wLYTubw9a1iTSorT3hrQ.b['6'][1]++;}__cov_R2wLYTubw9a1iTSorT3hrQ.s['21']++;var attrs=(__cov_R2wLYTubw9a1iTSorT3hrQ.b['7'][0]++,node.attributes)||(__cov_R2wLYTubw9a1iTSorT3hrQ.b['7'][1]++,{length:0});__cov_R2wLYTubw9a1iTSorT3hrQ.s['22']++;for(var i=0;i<attrs.length;i++){__cov_R2wLYTubw9a1iTSorT3hrQ.s['23']++;entry.attribs[attrs[i].name]=attrs[i].value;}__cov_R2wLYTubw9a1iTSorT3hrQ.s['24']++;entry.children=module.exports(childNodes);__cov_R2wLYTubw9a1iTSorT3hrQ.s['25']++;return entry;}__cov_R2wLYTubw9a1iTSorT3hrQ.s['26']++;module.exports=function(nodes){__cov_R2wLYTubw9a1iTSorT3hrQ.f['2']++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['27']++;if((__cov_R2wLYTubw9a1iTSorT3hrQ.b['9'][0]++,!nodes)||(__cov_R2wLYTubw9a1iTSorT3hrQ.b['9'][1]++,!nodes.length)){__cov_R2wLYTubw9a1iTSorT3hrQ.b['8'][0]++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['28']++;nodes=[nodes].filter(Boolean);}else{__cov_R2wLYTubw9a1iTSorT3hrQ.b['8'][1]++;__cov_R2wLYTubw9a1iTSorT3hrQ.s['29']++;nodes=Array.prototype.slice.call(nodes,0);}__cov_R2wLYTubw9a1iTSorT3hrQ.s['30']++;return Array.prototype.map.call(nodes,recurse).filter(Boolean);};

},{}],3:[function(require,module,exports){

var __cov_TUZXon8hZB30ZxzjvB5ZNA = (Function('return this'))();
if (!__cov_TUZXon8hZB30ZxzjvB5ZNA.__coverage__) { __cov_TUZXon8hZB30ZxzjvB5ZNA.__coverage__ = {}; }
__cov_TUZXon8hZB30ZxzjvB5ZNA = __cov_TUZXon8hZB30ZxzjvB5ZNA.__coverage__;
if (!(__cov_TUZXon8hZB30ZxzjvB5ZNA['/home/tim/git/diffhtml/lib/util/dom-parser.js'])) {
   __cov_TUZXon8hZB30ZxzjvB5ZNA['/home/tim/git/diffhtml/lib/util/dom-parser.js'] = {"path":"/home/tim/git/diffhtml/lib/util/dom-parser.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0},"fnMap":{"1":{"name":"(anonymous_1)","line":3,"loc":{"start":{"line":3,"column":36},"end":{"line":3,"column":47}}},"2":{"name":"(anonymous_2)","line":18,"loc":{"start":{"line":18,"column":34},"end":{"line":18,"column":57}}}},"statementMap":{"1":{"start":{"line":3,"column":0},"end":{"line":3,"column":50}},"2":{"start":{"line":4,"column":0},"end":{"line":4,"column":42}},"3":{"start":{"line":5,"column":0},"end":{"line":5,"column":59}},"4":{"start":{"line":7,"column":0},"end":{"line":7,"column":27}},"5":{"start":{"line":10,"column":0},"end":{"line":16,"column":31}},"6":{"start":{"line":12,"column":2},"end":{"line":15,"column":3}},"7":{"start":{"line":14,"column":4},"end":{"line":14,"column":11}},"8":{"start":{"line":18,"column":0},"end":{"line":36,"column":2}},"9":{"start":{"line":19,"column":2},"end":{"line":21,"column":3}},"10":{"start":{"line":20,"column":4},"end":{"line":20,"column":55}},"11":{"start":{"line":23,"column":2},"end":{"line":23,"column":59}},"12":{"start":{"line":24,"column":2},"end":{"line":24,"column":36}},"13":{"start":{"line":25,"column":2},"end":{"line":25,"column":16}},"14":{"start":{"line":27,"column":2},"end":{"line":27,"column":29}},"15":{"start":{"line":28,"column":2},"end":{"line":28,"column":40}},"16":{"start":{"line":30,"column":2},"end":{"line":33,"column":3}},"17":{"start":{"line":32,"column":4},"end":{"line":32,"column":41}},"18":{"start":{"line":35,"column":2},"end":{"line":35,"column":13}}},"branchMap":{"1":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":16},"end":{"line":3,"column":32}},{"start":{"line":3,"column":36},"end":{"line":3,"column":49}}]},"2":{"line":12,"type":"if","locations":[{"start":{"line":12,"column":2},"end":{"line":12,"column":2}},{"start":{"line":12,"column":2},"end":{"line":12,"column":2}}]},"3":{"line":19,"type":"if","locations":[{"start":{"line":19,"column":2},"end":{"line":19,"column":2}},{"start":{"line":19,"column":2},"end":{"line":19,"column":2}}]},"4":{"line":30,"type":"if","locations":[{"start":{"line":30,"column":2},"end":{"line":30,"column":2}},{"start":{"line":30,"column":2},"end":{"line":30,"column":2}}]},"5":{"line":30,"type":"binary-expr","locations":[{"start":{"line":30,"column":6},"end":{"line":30,"column":37}},{"start":{"line":31,"column":7},"end":{"line":31,"column":51}}]}}};
}
__cov_TUZXon8hZB30ZxzjvB5ZNA = __cov_TUZXon8hZB30ZxzjvB5ZNA['/home/tim/git/diffhtml/lib/util/dom-parser.js'];
__cov_TUZXon8hZB30ZxzjvB5ZNA.s['1']++;var DOMParser=(__cov_TUZXon8hZB30ZxzjvB5ZNA.b['1'][0]++,window.DOMParser)||(__cov_TUZXon8hZB30ZxzjvB5ZNA.b['1'][1]++,function(){__cov_TUZXon8hZB30ZxzjvB5ZNA.f['1']++;});__cov_TUZXon8hZB30ZxzjvB5ZNA.s['2']++;var DOMParser_proto=DOMParser.prototype;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['3']++;var real_parseFromString=DOMParser_proto.parseFromString;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['4']++;module.exports=DOMParser;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['5']++;try{__cov_TUZXon8hZB30ZxzjvB5ZNA.s['6']++;if(new DOMParser().parseFromString('','text/html')){__cov_TUZXon8hZB30ZxzjvB5ZNA.b['2'][0]++;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['7']++;return;}else{__cov_TUZXon8hZB30ZxzjvB5ZNA.b['2'][1]++;}}catch(unhandledException){}__cov_TUZXon8hZB30ZxzjvB5ZNA.s['8']++;DOMParser_proto.parseFromString=function(markup,type){__cov_TUZXon8hZB30ZxzjvB5ZNA.f['2']++;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['9']++;if(!/^\s*text\/html\s*(?:;|$)/i.test(type)){__cov_TUZXon8hZB30ZxzjvB5ZNA.b['3'][0]++;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['10']++;return real_parseFromString.apply(this,arguments);}else{__cov_TUZXon8hZB30ZxzjvB5ZNA.b['3'][1]++;}__cov_TUZXon8hZB30ZxzjvB5ZNA.s['11']++;var doc=document.implementation.createHTMLDocument('');__cov_TUZXon8hZB30ZxzjvB5ZNA.s['12']++;var doc_elt=doc.documentElement;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['13']++;var first_elt;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['14']++;doc_elt.innerHTML=markup;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['15']++;first_elt=doc_elt.firstElementChild;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['16']++;if((__cov_TUZXon8hZB30ZxzjvB5ZNA.b['5'][0]++,doc_elt.childElementCount===1)&&(__cov_TUZXon8hZB30ZxzjvB5ZNA.b['5'][1]++,first_elt.localName.toLowerCase()==='html')){__cov_TUZXon8hZB30ZxzjvB5ZNA.b['4'][0]++;__cov_TUZXon8hZB30ZxzjvB5ZNA.s['17']++;doc.replaceChild(first_elt,doc_elt);}else{__cov_TUZXon8hZB30ZxzjvB5ZNA.b['4'][1]++;}__cov_TUZXon8hZB30ZxzjvB5ZNA.s['18']++;return doc;};

},{}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":18}],6:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":38}],7:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":25}],8:[function(require,module,exports){
var diff = require("./diff.js")
var patch = require("./patch.js")
var h = require("./h.js")
var create = require("./create-element.js")
var VNode = require('./vnode/vnode.js')
var VText = require('./vnode/vtext.js')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}

},{"./create-element.js":5,"./diff.js":6,"./h.js":7,"./patch.js":16,"./vnode/vnode.js":34,"./vnode/vtext.js":36}],9:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],10:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":12}],11:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":11}],13:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":4}],14:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],15:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],16:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":21}],17:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":29,"is-object":14}],18:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":27,"../vnode/is-vnode.js":30,"../vnode/is-vtext.js":31,"../vnode/is-widget.js":32,"./apply-properties":17,"global/document":13}],19:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],20:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":32,"../vnode/vpatch.js":35,"./apply-properties":17,"./create-element":18,"./update-widget":22}],21:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":19,"./patch-op":20,"global/document":13,"x-is-array":15}],22:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":32}],23:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":10}],24:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],25:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":28,"../vnode/is-vhook":29,"../vnode/is-vnode":30,"../vnode/is-vtext":31,"../vnode/is-widget":32,"../vnode/vnode.js":34,"../vnode/vtext.js":36,"./hooks/ev-hook.js":23,"./hooks/soft-set-hook.js":24,"./parse-tag.js":26,"x-is-array":15}],26:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":9}],27:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":28,"./is-vnode":30,"./is-vtext":31,"./is-widget":32}],28:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],29:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],30:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":33}],31:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":33}],32:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],33:[function(require,module,exports){
module.exports = "2"

},{}],34:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":28,"./is-vhook":29,"./is-vnode":30,"./is-widget":32,"./version":33}],35:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":33}],36:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":33}],37:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":29,"is-object":14}],38:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":27,"../vnode/is-thunk":28,"../vnode/is-vnode":30,"../vnode/is-vtext":31,"../vnode/is-widget":32,"../vnode/vpatch":35,"./diff-props":37,"x-is-array":15}]},{},[1])(1)
});