(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('diffhtml/lib/util/caches'), require('diffhtml/lib/util/decode-entities'), require('diffhtml/lib/util/escape'), require('diffhtml/lib/util/make-measure'), require('diffhtml/lib/util/memory'), require('diffhtml/lib/util/parser'), require('diffhtml/lib/util/pool'), require('diffhtml/lib/util/process'), require('diffhtml/lib/util/svg')) :
	typeof define === 'function' && define.amd ? define(['exports', 'diffhtml/lib/util/caches', 'diffhtml/lib/util/decode-entities', 'diffhtml/lib/util/escape', 'diffhtml/lib/util/make-measure', 'diffhtml/lib/util/memory', 'diffhtml/lib/util/parser', 'diffhtml/lib/util/pool', 'diffhtml/lib/util/process', 'diffhtml/lib/util/svg'], factory) :
	(factory((global.sharedInternals = global.sharedInternals || {}),global.diffhtml_lib_util_caches,global.diffhtml_lib_util_decodeEntities,global.diffhtml_lib_util_escape,global.diffhtml_lib_util_makeMeasure,global.diffhtml_lib_util_memory,global.diffhtml_lib_util_parser,global.diffhtml_lib_util_pool,global.diffhtml_lib_util_process,global.diffhtml_lib_util_svg));
}(this, (function (exports,diffhtml_lib_util_caches,diffhtml_lib_util_decodeEntities,diffhtml_lib_util_escape,diffhtml_lib_util_makeMeasure,diffhtml_lib_util_memory,diffhtml_lib_util_parser,diffhtml_lib_util_pool,diffhtml_lib_util_process,diffhtml_lib_util_svg) { 'use strict';

Object.keys(diffhtml_lib_util_caches).forEach(function (key) { exports[key] = diffhtml_lib_util_caches[key]; });
Object.keys(diffhtml_lib_util_decodeEntities).forEach(function (key) { exports[key] = diffhtml_lib_util_decodeEntities[key]; });
Object.keys(diffhtml_lib_util_escape).forEach(function (key) { exports[key] = diffhtml_lib_util_escape[key]; });
Object.keys(diffhtml_lib_util_makeMeasure).forEach(function (key) { exports[key] = diffhtml_lib_util_makeMeasure[key]; });
Object.keys(diffhtml_lib_util_memory).forEach(function (key) { exports[key] = diffhtml_lib_util_memory[key]; });
Object.keys(diffhtml_lib_util_parser).forEach(function (key) { exports[key] = diffhtml_lib_util_parser[key]; });
Object.keys(diffhtml_lib_util_pool).forEach(function (key) { exports[key] = diffhtml_lib_util_pool[key]; });
Object.keys(diffhtml_lib_util_process).forEach(function (key) { exports[key] = diffhtml_lib_util_process[key]; });
Object.keys(diffhtml_lib_util_svg).forEach(function (key) { exports[key] = diffhtml_lib_util_svg[key]; });

Object.defineProperty(exports, '__esModule', { value: true });

})));
