/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 298:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __dirname = "/";
/* module decorator */ module = __webpack_require__.nmd(module);

// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort

var Module;Module||(Module=typeof Module !== 'undefined' ? Module : {});null;
Module.onRuntimeInitialized=function(){function a(h,n){this.Qa=h;this.db=n;this.Pa=1;this.wb=[]}function b(h,n){this.db=n;n=d(h)+1;this.hb=aa(n);if(null===this.hb)throw Error("Unable to allocate memory for the SQL string");p(h,u,this.hb,n);this.sb=this.hb;this.eb=this.Mb=null}function c(h,{filename:n=!1}={}){!1===n?(this.filename="dbfile_"+(4294967295*Math.random()>>>0),this.Xc=!0,null!=h&&w.zb("/",this.filename,h,!0,!0)):this.filename=h;this.handleError(g(this.filename,e));this.db=z(e,"i32");Cb(this.db);
this.nb={};this.Xa={}}var e=C(4),f=Module.cwrap,g=f("sqlite3_open","number",["string","number"]),k=f("sqlite3_close_v2","number",["number"]),l=f("sqlite3_exec","number",["number","string","number","number","number"]),q=f("sqlite3_changes","number",["number"]),m=f("sqlite3_prepare_v2","number",["number","string","number","number","number"]),r=f("sqlite3_sql","string",["number"]),x=f("sqlite3_normalized_sql","string",["number"]),B=f("sqlite3_prepare_v2","number",["number","number","number","number",
"number"]),E=f("sqlite3_bind_text","number",["number","number","number","number","number"]),A=f("sqlite3_bind_blob","number",["number","number","number","number","number"]),J=f("sqlite3_bind_double","number",["number","number","number"]),Z=f("sqlite3_bind_int","number",["number","number","number"]),U=f("sqlite3_bind_parameter_index","number",["number","string"]),Ka=f("sqlite3_step","number",["number"]),G=f("sqlite3_errmsg","string",["number"]),Db=f("sqlite3_column_count","number",["number"]),Eb=f("sqlite3_data_count",
"number",["number"]),Fb=f("sqlite3_column_double","number",["number","number"]),Gb=f("sqlite3_column_text","string",["number","number"]),Hb=f("sqlite3_column_blob","number",["number","number"]),Ib=f("sqlite3_column_bytes","number",["number","number"]),Jb=f("sqlite3_column_type","number",["number","number"]),Kb=f("sqlite3_column_name","string",["number","number"]),Lb=f("sqlite3_reset","number",["number"]),Mb=f("sqlite3_clear_bindings","number",["number"]),Nb=f("sqlite3_finalize","number",["number"]),
Ob=f("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),Pb=f("sqlite3_value_type","number",["number"]),Qb=f("sqlite3_value_bytes","number",["number"]),Rb=f("sqlite3_value_text","string",["number"]),Sb=f("sqlite3_value_blob","number",["number"]),Tb=f("sqlite3_value_double","number",["number"]),Ub=f("sqlite3_result_double","",["number","number"]),db=f("sqlite3_result_null","",["number"]),Vb=f("sqlite3_result_text","",["number","string",
"number","number"]),Wb=f("sqlite3_result_blob","",["number","number","number","number"]),Xb=f("sqlite3_result_int","",["number","number"]),eb=f("sqlite3_result_error","",["number","string","number"]),Cb=f("RegisterExtensionFunctions","number",["number"]);a.prototype.bind=function(h){if(!this.Qa)throw"Statement closed";this.reset();return Array.isArray(h)?this.vc(h):null!=h&&"object"===typeof h?this.wc(h):!0};a.prototype.step=function(){if(!this.Qa)throw"Statement closed";this.Pa=1;var h=Ka(this.Qa);
switch(h){case 100:return!0;case 101:return!1;default:throw this.db.handleError(h);}};a.prototype.Pc=function(h){null==h&&(h=this.Pa,this.Pa+=1);return Fb(this.Qa,h)};a.prototype.Qc=function(h){null==h&&(h=this.Pa,this.Pa+=1);return Gb(this.Qa,h)};a.prototype.getBlob=function(h){null==h&&(h=this.Pa,this.Pa+=1);var n=Ib(this.Qa,h);h=Hb(this.Qa,h);for(var t=new Uint8Array(n),v=0;v<n;v+=1)t[v]=D[h+v];return t};a.prototype.get=function(h){null!=h&&this.bind(h)&&this.step();h=[];for(var n=Eb(this.Qa),
t=0;t<n;t+=1)switch(Jb(this.Qa,t)){case 1:case 2:h.push(this.Pc(t));break;case 3:h.push(this.Qc(t));break;case 4:h.push(this.getBlob(t));break;default:h.push(null)}return h};a.prototype.getColumnNames=function(){for(var h=[],n=Db(this.Qa),t=0;t<n;t+=1)h.push(Kb(this.Qa,t));return h};a.prototype.getAsObject=function(h){h=this.get(h);for(var n=this.getColumnNames(),t={},v=0;v<n.length;v+=1)t[n[v]]=h[v];return t};a.prototype.getSQL=function(){return r(this.Qa)};a.prototype.getNormalizedSQL=function(){return x(this.Qa)};
a.prototype.run=function(h){null!=h&&this.bind(h);this.step();return this.reset()};a.prototype.zc=function(h,n){null==n&&(n=this.Pa,this.Pa+=1);h=ba(h);var t=ca(h);this.wb.push(t);this.db.handleError(E(this.Qa,n,t,h.length-1,0))};a.prototype.uc=function(h,n){null==n&&(n=this.Pa,this.Pa+=1);var t=ca(h);this.wb.push(t);this.db.handleError(A(this.Qa,n,t,h.length,0))};a.prototype.yc=function(h,n){null==n&&(n=this.Pa,this.Pa+=1);this.db.handleError((h===(h|0)?Z:J)(this.Qa,n,h))};a.prototype.xc=function(h){null==
h&&(h=this.Pa,this.Pa+=1);A(this.Qa,h,0,0,0)};a.prototype.Tb=function(h,n){null==n&&(n=this.Pa,this.Pa+=1);switch(typeof h){case "string":this.zc(h,n);return;case "number":case "boolean":this.yc(h+0,n);return;case "object":if(null===h){this.xc(n);return}if(null!=h.length){this.uc(h,n);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+h+").";};a.prototype.wc=function(h){var n=this;Object.keys(h).forEach(function(t){var v=U(n.Qa,t);0!==v&&n.Tb(h[t],v)});return!0};a.prototype.vc=
function(h){for(var n=0;n<h.length;n+=1)this.Tb(h[n],n+1);return!0};a.prototype.reset=function(){return 0===Mb(this.Qa)&&0===Lb(this.Qa)};a.prototype.freemem=function(){for(var h;void 0!==(h=this.wb.pop());)da(h)};a.prototype.free=function(){var h=0===Nb(this.Qa);delete this.db.nb[this.Qa];this.Qa=0;return h};b.prototype.next=function(){if(null===this.hb)return{done:!0};null!==this.eb&&(this.eb.free(),this.eb=null);if(!this.db.db)throw this.Bb(),Error("Database closed");var h=ha(),n=C(4);ia(e);ia(n);
try{this.db.handleError(B(this.db.db,this.sb,-1,e,n));this.sb=z(n,"i32");var t=z(e,"i32");if(0===t)return this.Bb(),{done:!0};this.eb=new a(t,this.db);this.db.nb[t]=this.eb;return{value:this.eb,done:!1}}catch(v){throw this.Mb=F(this.sb),this.Bb(),v;}finally{ja(h)}};b.prototype.Bb=function(){da(this.hb);this.hb=null};b.prototype.getRemainingSQL=function(){return null!==this.Mb?this.Mb:F(this.sb)};"function"===typeof Symbol&&"symbol"===typeof Symbol.iterator&&(b.prototype[Symbol.iterator]=function(){return this});
c.prototype.run=function(h,n){if(!this.db)throw"Database closed";if(n){h=this.prepare(h,n);try{h.step()}finally{h.free()}}else this.handleError(l(this.db,h,0,0,e));return this};c.prototype.exec=function(h,n){if(!this.db)throw"Database closed";var t=ha(),v=null;try{var y=d(h)+1,N=C(y);p(h,D,N,y);var H=N;var ea=C(4);for(h=[];0!==z(H,"i8");){ia(e);ia(ea);this.handleError(B(this.db,H,-1,e,ea));var fa=z(e,"i32");H=z(ea,"i32");if(0!==fa){y=null;v=new a(fa,this);for(null!=n&&v.bind(n);v.step();)null===y&&
(y={columns:v.getColumnNames(),values:[]},h.push(y)),y.values.push(v.get());v.free()}}return h}catch(I){throw v&&v.free(),I;}finally{ja(t)}};c.prototype.each=function(h,n,t,v){"function"===typeof n&&(v=t,t=n,n=void 0);h=this.prepare(h,n);try{for(;h.step();)t(h.getAsObject())}finally{h.free()}if("function"===typeof v)return v()};c.prototype.prepare=function(h,n){ia(e);this.handleError(m(this.db,h,-1,e,0));h=z(e,"i32");if(0===h)throw"Nothing to prepare";var t=new a(h,this);null!=n&&t.bind(n);return this.nb[h]=
t};c.prototype.iterateStatements=function(h){return new b(h,this)};c.prototype["export"]=function(){Object.values(this.nb).forEach(function(n){n.free()});Object.values(this.Xa).forEach(ka);this.Xa={};this.handleError(k(this.db));var h=w.readFile(this.filename,{encoding:"binary"});this.handleError(g(this.filename,e));this.db=z(e,"i32");return h};c.prototype.close=function(){null!==this.db&&(Object.values(this.nb).forEach(function(h){h.free()}),Object.values(this.Xa).forEach(ka),this.Xa={},this.handleError(k(this.db)),
this.Xc&&w.unlink("/"+this.filename),this.db=null)};c.prototype.handleError=function(h){if(0===h)return null;h=G(this.db);throw Error(h);};c.prototype.getRowsModified=function(){return q(this.db)};c.prototype.create_function=function(h,n){Object.prototype.hasOwnProperty.call(this.Xa,h)&&(ka(this.Xa[h]),delete this.Xa[h]);var t=la(function(v,y,N){for(var H,ea=[],fa=0;fa<y;fa+=1){var I=z(N+4*fa,"i32"),S=Pb(I);if(1===S||2===S)I=Tb(I);else if(3===S)I=Rb(I);else if(4===S){S=I;I=Qb(S);S=Sb(S);for(var fb=
new Uint8Array(I),Aa=0;Aa<I;Aa+=1)fb[Aa]=D[S+Aa];I=fb}else I=null;ea.push(I)}try{H=n.apply(null,ea)}catch(Yb){eb(v,Yb,-1);return}switch(typeof H){case "boolean":Xb(v,H?1:0);break;case "number":Ub(v,H);break;case "string":Vb(v,H,-1,-1);break;case "object":null===H?db(v):null!=H.length?(y=ca(H),Wb(v,y,H.length,-1),da(y)):eb(v,"Wrong API use : tried to return a value of an unknown type ("+H+").",-1);break;default:db(v)}},"viii");this.Xa[h]=t;this.handleError(Ob(this.db,h,n.length,1,0,t,0,0,0));return this};
Module.Database=c;var ra=new Map;Module.register_for_idb=h=>{let n=la(function(y,N){y=ra.get(y);return h.lock(y,N)?0:5},"iii"),t=la(function(y,N){y=ra.get(y);h.unlock(y,N);return 0},"iii"),v=la(function(y,N){y=F(y);ra.set(N,y)},"vii");Module._register_for_idb(n,t,v)};Module.cleanup_file=h=>{let n=[...ra.entries()].find(t=>t[1]===h);ra.delete(n[0])};Module.reset_filesystem=()=>{w.root=null;w.lc()}};var ma={},K;for(K in Module)Module.hasOwnProperty(K)&&(ma[K]=Module[K]);
var na="./this.program",oa="object"===typeof window,pa="function"===typeof importScripts,qa="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node,L="",sa,ta,ua,va,wa;
if(qa)L=pa?__webpack_require__(21).dirname(L)+"/":__dirname+"/",sa=function(a,b){va||(va=__webpack_require__(994));wa||(wa=__webpack_require__(21));a=wa.normalize(a);return va.readFileSync(a,b?null:"utf8")},ua=function(a){a=sa(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a},ta=function(a,b,c){va||(va=__webpack_require__(994));wa||(wa=__webpack_require__(21));a=wa.normalize(a);va.readFile(a,function(e,f){e?c(e):b(f.buffer)})},1<process.argv.length&&(na=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2), true&&
(module.exports=Module),Module.inspect=function(){return"[Emscripten Module object]"};else if(oa||pa)pa?L=self.location.href:"undefined"!==typeof document&&document.currentScript&&(L=document.currentScript.src),L=0!==L.indexOf("blob:")?L.substr(0,L.lastIndexOf("/")+1):"",sa=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},pa&&(ua=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)}),
ta=function(a,b,c){var e=new XMLHttpRequest;e.open("GET",a,!0);e.responseType="arraybuffer";e.onload=function(){200==e.status||0==e.status&&e.response?b(e.response):c()};e.onerror=c;e.send(null)};var xa=Module.print||console.log.bind(console),M=Module.printErr||console.warn.bind(console);for(K in ma)ma.hasOwnProperty(K)&&(Module[K]=ma[K]);ma=null;Module.thisProgram&&(na=Module.thisProgram);var ya=[],za;function ka(a){za.delete(O.get(a));ya.push(a)}
function la(a,b){if(!za){za=new WeakMap;for(var c=0;c<O.length;c++){var e=O.get(c);e&&za.set(e,c)}}if(za.has(a))a=za.get(a);else{if(ya.length)c=ya.pop();else{try{O.grow(1)}catch(l){if(!(l instanceof RangeError))throw l;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}c=O.length-1}try{O.set(c,a)}catch(l){if(!(l instanceof TypeError))throw l;if("function"===typeof WebAssembly.Function){var f={i:"i32",j:"i64",f:"f32",d:"f64"},g={parameters:[],results:"v"==b[0]?[]:[f[b[0]]]};for(e=1;e<b.length;++e)g.parameters.push(f[b[e]]);
b=new WebAssembly.Function(g,a)}else{f=[1,0,1,96];g=b.slice(0,1);b=b.slice(1);var k={i:127,j:126,f:125,d:124};f.push(b.length);for(e=0;e<b.length;++e)f.push(k[b[e]]);"v"==g?f.push(0):f=f.concat([1,k[g]]);f[1]=f.length-2;b=new Uint8Array([0,97,115,109,1,0,0,0].concat(f,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));b=new WebAssembly.Module(b);b=(new WebAssembly.Instance(b,{e:{f:a}})).exports.f}O.set(c,b)}za.set(a,c);a=c}return a}var Ba;Module.wasmBinary&&(Ba=Module.wasmBinary);
var noExitRuntime=Module.noExitRuntime||!0;"object"!==typeof WebAssembly&&P("no native wasm support detected");
function ia(a){var b="i32";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":D[a>>0]=0;break;case "i8":D[a>>0]=0;break;case "i16":Ca[a>>1]=0;break;case "i32":Q[a>>2]=0;break;case "i64":R=[0,(T=0,1<=+Math.abs(T)?0<T?(Math.min(+Math.floor(T/4294967296),4294967295)|0)>>>0:~~+Math.ceil((T-+(~~T>>>0))/4294967296)>>>0:0)];Q[a>>2]=R[0];Q[a+4>>2]=R[1];break;case "float":Da[a>>2]=0;break;case "double":Ea[a>>3]=0;break;default:P("invalid type for setValue: "+b)}}
function z(a,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return D[a>>0];case "i8":return D[a>>0];case "i16":return Ca[a>>1];case "i32":return Q[a>>2];case "i64":return Q[a>>2];case "float":return Da[a>>2];case "double":return Ea[a>>3];default:P("invalid type for getValue: "+b)}return null}var Fa,Ga=!1;function assert(a,b){a||P("Assertion failed: "+b)}function Ha(a){var b=Module["_"+a];assert(b,"Cannot call unknown function "+a+", make sure it is exported");return b}
function Ia(a,b,c,e){var f={string:function(m){var r=0;if(null!==m&&void 0!==m&&0!==m){var x=(m.length<<2)+1;r=C(x);p(m,u,r,x)}return r},array:function(m){var r=C(m.length);D.set(m,r);return r}},g=Ha(a),k=[];a=0;if(e)for(var l=0;l<e.length;l++){var q=f[c[l]];q?(0===a&&(a=ha()),k[l]=q(e[l])):k[l]=e[l]}c=g.apply(null,k);c=function(m){return"string"===b?F(m):"boolean"===b?!!m:m}(c);0!==a&&ja(a);return c}var Ja=0,La=1;
function ca(a){var b=Ja==La?C(a.length):aa(a.length);a.subarray||a.slice?u.set(a,b):u.set(new Uint8Array(a),b);return b}var Ma="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function Na(a,b,c){var e=b+c;for(c=b;a[c]&&!(c>=e);)++c;if(16<c-b&&a.subarray&&Ma)return Ma.decode(a.subarray(b,c));for(e="";b<c;){var f=a[b++];if(f&128){var g=a[b++]&63;if(192==(f&224))e+=String.fromCharCode((f&31)<<6|g);else{var k=a[b++]&63;f=224==(f&240)?(f&15)<<12|g<<6|k:(f&7)<<18|g<<12|k<<6|a[b++]&63;65536>f?e+=String.fromCharCode(f):(f-=65536,e+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else e+=String.fromCharCode(f)}return e}function F(a,b){return a?Na(u,a,b):""}
function p(a,b,c,e){if(!(0<e))return 0;var f=c;e=c+e-1;for(var g=0;g<a.length;++g){var k=a.charCodeAt(g);if(55296<=k&&57343>=k){var l=a.charCodeAt(++g);k=65536+((k&1023)<<10)|l&1023}if(127>=k){if(c>=e)break;b[c++]=k}else{if(2047>=k){if(c+1>=e)break;b[c++]=192|k>>6}else{if(65535>=k){if(c+2>=e)break;b[c++]=224|k>>12}else{if(c+3>=e)break;b[c++]=240|k>>18;b[c++]=128|k>>12&63}b[c++]=128|k>>6&63}b[c++]=128|k&63}}b[c]=0;return c-f}
function d(a){for(var b=0,c=0;c<a.length;++c){var e=a.charCodeAt(c);55296<=e&&57343>=e&&(e=65536+((e&1023)<<10)|a.charCodeAt(++c)&1023);127>=e?++b:b=2047>=e?b+2:65535>=e?b+3:b+4}return b}function Oa(a){var b=d(a)+1,c=aa(b);c&&p(a,D,c,b);return c}var Pa,D,u,Ca,Q,Da,Ea;
function Qa(){var a=Fa.buffer;Pa=a;Module.HEAP8=D=new Int8Array(a);Module.HEAP16=Ca=new Int16Array(a);Module.HEAP32=Q=new Int32Array(a);Module.HEAPU8=u=new Uint8Array(a);Module.HEAPU16=new Uint16Array(a);Module.HEAPU32=new Uint32Array(a);Module.HEAPF32=Da=new Float32Array(a);Module.HEAPF64=Ea=new Float64Array(a)}var O,Ra=[],Sa=[],Ta=[];function Ua(){var a=Module.preRun.shift();Ra.unshift(a)}var Va=0,Wa=null,Xa=null;
function Ya(){Va++;Module.monitorRunDependencies&&Module.monitorRunDependencies(Va)}function Za(){Va--;Module.monitorRunDependencies&&Module.monitorRunDependencies(Va);if(0==Va&&(null!==Wa&&(clearInterval(Wa),Wa=null),Xa)){var a=Xa;Xa=null;a()}}Module.preloadedImages={};Module.preloadedAudios={};function P(a){if(Module.onAbort)Module.onAbort(a);M(a);Ga=!0;throw new WebAssembly.RuntimeError("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");}
function $a(){return V.startsWith("data:application/octet-stream;base64,")}var V;V="sql-wasm.wasm";if(!$a()){var ab=V;V=Module.locateFile?Module.locateFile(ab,L):L+ab}function bb(){var a=V;try{if(a==V&&Ba)return new Uint8Array(Ba);if(ua)return ua(a);throw"both async and sync fetching of the wasm failed";}catch(b){P(b)}}
function cb(){if(!Ba&&(oa||pa)){if("function"===typeof fetch&&!V.startsWith("file://"))return fetch(V,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+V+"'";return a.arrayBuffer()}).catch(function(){return bb()});if(ta)return new Promise(function(a,b){ta(V,function(c){a(new Uint8Array(c))},b)})}return Promise.resolve().then(function(){return bb()})}var T,R;
function gb(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b(Module);else{var c=b.pd;"number"===typeof c?void 0===b.yb?O.get(c)():O.get(c)(b.yb):c(void 0===b.yb?null:b.yb)}}}function hb(a){return a.replace(/\b_Z[\w\d_]+/g,function(b){return b===b?b:b+" ["+b+"]"})}
function ib(){function a(k){return(k=k.toTimeString().match(/\(([A-Za-z ]+)\)$/))?k[1]:"GMT"}if(!jb){jb=!0;var b=(new Date).getFullYear(),c=new Date(b,0,1),e=new Date(b,6,1);b=c.getTimezoneOffset();var f=e.getTimezoneOffset(),g=Math.max(b,f);Q[kb()>>2]=60*g;Q[lb()>>2]=Number(b!=f);c=a(c);e=a(e);c=Oa(c);e=Oa(e);f<b?(Q[mb()>>2]=c,Q[mb()+4>>2]=e):(Q[mb()>>2]=e,Q[mb()+4>>2]=c)}}var jb;
function nb(a,b){for(var c=0,e=a.length-1;0<=e;e--){var f=a[e];"."===f?a.splice(e,1):".."===f?(a.splice(e,1),c++):c&&(a.splice(e,1),c--)}if(b)for(;c;c--)a.unshift("..");return a}function ob(a){var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=nb(a.split("/").filter(function(e){return!!e}),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a}
function pb(a){var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b}function W(a){if("/"===a)return"/";a=ob(a);a=a.replace(/\/$/,"");var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}function qb(a,b){return ob(a+"/"+b)}
function rb(){if("object"===typeof crypto&&"function"===typeof crypto.getRandomValues){var a=new Uint8Array(1);return function(){crypto.getRandomValues(a);return a[0]}}if(qa)try{var b=__webpack_require__(74);return function(){return b.randomBytes(1)[0]}}catch(c){}return function(){P("randomDevice")}}
function sb(){for(var a="",b=!1,c=arguments.length-1;-1<=c&&!b;c--){b=0<=c?arguments[c]:w.cwd();if("string"!==typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b="/"===b.charAt(0)}a=nb(a.split("/").filter(function(e){return!!e}),!b).join("/");return(b?"/":"")+a||"."}
function tb(a,b){function c(k){for(var l=0;l<k.length&&""===k[l];l++);for(var q=k.length-1;0<=q&&""===k[q];q--);return l>q?[]:k.slice(l,q-l+1)}a=sb(a).substr(1);b=sb(b).substr(1);a=c(a.split("/"));b=c(b.split("/"));for(var e=Math.min(a.length,b.length),f=e,g=0;g<e;g++)if(a[g]!==b[g]){f=g;break}e=[];for(g=f;g<a.length;g++)e.push("..");e=e.concat(b.slice(f));return e.join("/")}var ub=[];function vb(a,b){ub[a]={input:[],output:[],gb:b};w.Qb(a,wb)}
var wb={open:function(a){var b=ub[a.node.rdev];if(!b)throw new w.ErrnoError(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.gb.flush(a.tty)},flush:function(a){a.tty.gb.flush(a.tty)},read:function(a,b,c,e){if(!a.tty||!a.tty.gb.cc)throw new w.ErrnoError(60);for(var f=0,g=0;g<e;g++){try{var k=a.tty.gb.cc(a.tty)}catch(l){throw new w.ErrnoError(29);}if(void 0===k&&0===f)throw new w.ErrnoError(6);if(null===k||void 0===k)break;f++;b[c+g]=k}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,
c,e){if(!a.tty||!a.tty.gb.Nb)throw new w.ErrnoError(60);try{for(var f=0;f<e;f++)a.tty.gb.Nb(a.tty,b[c+f])}catch(g){throw new w.ErrnoError(29);}e&&(a.node.timestamp=Date.now());return f}},xb={cc:function(a){if(!a.input.length){var b=null;if(qa){var c=Buffer.alloc(256),e=0;try{e=va.readSync(process.stdin.fd,c,0,256,null)}catch(f){if(f.toString().includes("EOF"))e=0;else throw f;}0<e?b=c.slice(0,e).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),
null!==b&&(b+="\n")):"function"==typeof readline&&(b=readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=ba(b,!0)}return a.input.shift()},Nb:function(a,b){null===b||10===b?(xa(Na(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(xa(Na(a.output,0)),a.output=[])}},yb={Nb:function(a,b){null===b||10===b?(M(Na(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(M(Na(a.output,0)),a.output=[])}};
function zb(a){a=65536*Math.ceil(a/65536);var b=Ab(65536,a);if(!b)return 0;u.fill(0,b,b+a);return b}
var X={Va:null,mount:function(){return X.createNode(null,"/",16895,0)},createNode:function(a,b,c,e){if(w.Rc(c)||w.isFIFO(c))throw new w.ErrnoError(63);X.Va||(X.Va={dir:{node:{getattr:X.node_ops.getattr,setattr:X.node_ops.setattr,lookup:X.node_ops.lookup,mknod:X.node_ops.mknod,rename:X.node_ops.rename,unlink:X.node_ops.unlink,rmdir:X.node_ops.rmdir,readdir:X.node_ops.readdir,symlink:X.node_ops.symlink},stream:{llseek:X.stream_ops.llseek}},file:{node:{getattr:X.node_ops.getattr,setattr:X.node_ops.setattr},
stream:{llseek:X.stream_ops.llseek,read:X.stream_ops.read,write:X.stream_ops.write,allocate:X.stream_ops.allocate,mmap:X.stream_ops.mmap,msync:X.stream_ops.msync}},link:{node:{getattr:X.node_ops.getattr,setattr:X.node_ops.setattr,readlink:X.node_ops.readlink},stream:{}},Vb:{node:{getattr:X.node_ops.getattr,setattr:X.node_ops.setattr},stream:w.Cc}});c=w.createNode(a,b,c,e);w.isDir(c.mode)?(c.node_ops=X.Va.dir.node,c.stream_ops=X.Va.dir.stream,c.Na={}):w.isFile(c.mode)?(c.node_ops=X.Va.file.node,c.stream_ops=
X.Va.file.stream,c.Ra=0,c.Na=null):w.fb(c.mode)?(c.node_ops=X.Va.link.node,c.stream_ops=X.Va.link.stream):w.pb(c.mode)&&(c.node_ops=X.Va.Vb.node,c.stream_ops=X.Va.Vb.stream);c.timestamp=Date.now();a&&(a.Na[b]=c,a.timestamp=c.timestamp);return c},qd:function(a){return a.Na?a.Na.subarray?a.Na.subarray(0,a.Ra):new Uint8Array(a.Na):new Uint8Array(0)},Zb:function(a,b){var c=a.Na?a.Na.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)>>>0),0!=c&&(b=Math.max(b,256)),c=a.Na,a.Na=new Uint8Array(b),0<a.Ra&&
a.Na.set(c.subarray(0,a.Ra),0))},gd:function(a,b){if(a.Ra!=b)if(0==b)a.Na=null,a.Ra=0;else{var c=a.Na;a.Na=new Uint8Array(b);c&&a.Na.set(c.subarray(0,Math.min(b,a.Ra)));a.Ra=b}},node_ops:{getattr:function(a){var b={};b.dev=w.pb(a.mode)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;w.isDir(a.mode)?b.size=4096:w.isFile(a.mode)?b.size=a.Ra:w.fb(a.mode)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.Ac=
4096;b.blocks=Math.ceil(b.size/b.Ac);return b},setattr:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&X.gd(a,b.size)},lookup:function(){throw w.Db[44];},mknod:function(a,b,c,e){return X.createNode(a,b,c,e)},rename:function(a,b,c){if(w.isDir(a.mode)){try{var e=w.lookupNode(b,c)}catch(g){}if(e)for(var f in e.Na)throw new w.ErrnoError(55);}delete a.parent.Na[a.name];a.parent.timestamp=Date.now();a.name=c;b.Na[c]=a;b.timestamp=a.parent.timestamp;
a.parent=b},unlink:function(a,b){delete a.Na[b];a.timestamp=Date.now()},rmdir:function(a,b){var c=w.lookupNode(a,b),e;for(e in c.Na)throw new w.ErrnoError(55);delete a.Na[b];a.timestamp=Date.now()},readdir:function(a){var b=[".",".."],c;for(c in a.Na)a.Na.hasOwnProperty(c)&&b.push(c);return b},symlink:function(a,b,c){a=X.createNode(a,b,41471,0);a.link=c;return a},readlink:function(a){if(!w.fb(a.mode))throw new w.ErrnoError(28);return a.link}},stream_ops:{read:function(a,b,c,e,f){var g=a.node.Na;if(f>=
a.node.Ra)return 0;a=Math.min(a.node.Ra-f,e);if(8<a&&g.subarray)b.set(g.subarray(f,f+a),c);else for(e=0;e<a;e++)b[c+e]=g[f+e];return a},write:function(a,b,c,e,f,g){b.buffer===D.buffer&&(g=!1);if(!e)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.Na||a.Na.subarray)){if(g)return a.Na=b.subarray(c,c+e),a.Ra=e;if(0===a.Ra&&0===f)return a.Na=b.slice(c,c+e),a.Ra=e;if(f+e<=a.Ra)return a.Na.set(b.subarray(c,c+e),f),e}X.Zb(a,f+e);if(a.Na.subarray&&b.subarray)a.Na.set(b.subarray(c,c+e),f);else for(g=
0;g<e;g++)a.Na[f+g]=b[c+g];a.Ra=Math.max(a.Ra,f+e);return e},llseek:function(a,b,c){1===c?b+=a.position:2===c&&w.isFile(a.node.mode)&&(b+=a.node.Ra);if(0>b)throw new w.ErrnoError(28);return b},allocate:function(a,b,c){X.Zb(a.node,b+c);a.node.Ra=Math.max(a.node.Ra,b+c)},mmap:function(a,b,c,e,f,g){if(0!==b)throw new w.ErrnoError(28);if(!w.isFile(a.node.mode))throw new w.ErrnoError(43);a=a.node.Na;if(g&2||a.buffer!==Pa){if(0<e||e+c<a.length)a.subarray?a=a.subarray(e,e+c):a=Array.prototype.slice.call(a,
e,e+c);e=!0;c=zb(c);if(!c)throw new w.ErrnoError(48);D.set(a,c)}else e=!1,c=a.byteOffset;return{ed:c,vb:e}},msync:function(a,b,c,e,f){if(!w.isFile(a.node.mode))throw new w.ErrnoError(43);if(f&2)return 0;X.stream_ops.write(a,b,0,e,c,!1);return 0}}};function Bb(a,b,c){var e="al "+a;ta(a,function(f){assert(f,'Loading data file "'+a+'" failed (no arrayBuffer).');b(new Uint8Array(f));e&&Za()},function(){if(c)c();else throw'Loading data file "'+a+'" failed.';});e&&Ya()}
var w={root:null,mb:[],Xb:{},streams:[],Zc:1,Ua:null,Wb:"/",Hb:!1,hc:!0,Sa:{},nc:{kc:{qc:1,rc:2}},ErrnoError:null,Db:{},Lc:null,tb:0,lookupPath:function(a,b){a=sb(w.cwd(),a);b=b||{};if(!a)return{path:"",node:null};var c={Cb:!0,Pb:0},e;for(e in c)void 0===b[e]&&(b[e]=c[e]);if(8<b.Pb)throw new w.ErrnoError(32);a=nb(a.split("/").filter(function(k){return!!k}),!1);var f=w.root;c="/";for(e=0;e<a.length;e++){var g=e===a.length-1;if(g&&b.parent)break;f=w.lookupNode(f,a[e]);c=qb(c,a[e]);w.ab(f)&&(!g||g&&
b.Cb)&&(f=f.lb.root);if(!g||b.Ta)for(g=0;w.fb(f.mode);)if(f=w.readlink(c),c=sb(pb(c),f),f=w.lookupPath(c,{Pb:b.Pb}).node,40<g++)throw new w.ErrnoError(32);}return{path:c,node:f}},Ya:function(a){for(var b;;){if(w.isRoot(a))return a=a.mount.jc,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}},Gb:function(a,b){for(var c=0,e=0;e<b.length;e++)c=(c<<5)-c+b.charCodeAt(e)|0;return(a+c>>>0)%w.Ua.length},ec:function(a){var b=w.Gb(a.parent.id,a.name);a.cb=w.Ua[b];w.Ua[b]=a},fc:function(a){var b=
w.Gb(a.parent.id,a.name);if(w.Ua[b]===a)w.Ua[b]=a.cb;else for(b=w.Ua[b];b;){if(b.cb===a){b.cb=a.cb;break}b=b.cb}},lookupNode:function(a,b){var c=w.Vc(a);if(c)throw new w.ErrnoError(c,a);for(c=w.Ua[w.Gb(a.id,b)];c;c=c.cb){var e=c.name;if(c.parent.id===a.id&&e===b)return c}return w.lookup(a,b)},createNode:function(a,b,c,e){a=new w.FSNode(a,b,c,e);w.ec(a);return a},Ab:function(a){w.fc(a)},isRoot:function(a){return a===a.parent},ab:function(a){return!!a.lb},isFile:function(a){return 32768===(a&61440)},
isDir:function(a){return 16384===(a&61440)},fb:function(a){return 40960===(a&61440)},pb:function(a){return 8192===(a&61440)},Rc:function(a){return 24576===(a&61440)},isFIFO:function(a){return 4096===(a&61440)},isSocket:function(a){return 49152===(a&49152)},Mc:{r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},Yc:function(a){var b=w.Mc[a];if("undefined"===typeof b)throw Error("Unknown file open mode: "+a);return b},$b:function(a){var b=["r","w","rw"][a&3];a&512&&(b+="w");return b},Za:function(a,b){if(w.hc)return 0;
if(!b.includes("r")||a.mode&292){if(b.includes("w")&&!(a.mode&146)||b.includes("x")&&!(a.mode&73))return 2}else return 2;return 0},Vc:function(a){var b=w.Za(a,"x");return b?b:a.node_ops.lookup?0:2},Lb:function(a,b){try{return w.lookupNode(a,b),20}catch(c){}return w.Za(a,"wx")},qb:function(a,b,c){try{var e=w.lookupNode(a,b)}catch(f){return f.Oa}if(a=w.Za(a,"wx"))return a;if(c){if(!w.isDir(e.mode))return 54;if(w.isRoot(e)||w.Ya(e)===w.cwd())return 10}else if(w.isDir(e.mode))return 31;return 0},Wc:function(a,
b){return a?w.fb(a.mode)?32:w.isDir(a.mode)&&("r"!==w.$b(b)||b&512)?31:w.Za(a,w.$b(b)):44},oc:4096,$c:function(a,b){b=b||w.oc;for(a=a||0;a<=b;a++)if(!w.streams[a])return a;throw new w.ErrnoError(33);},$a:function(a){return w.streams[a]},Jc:function(a,b,c){w.ub||(w.ub=function(){},w.ub.prototype={object:{get:function(){return this.node},set:function(g){this.node=g}}});var e=new w.ub,f;for(f in a)e[f]=a[f];a=e;b=w.$c(b,c);a.fd=b;return w.streams[b]=a},Dc:function(a){w.streams[a]=null},Cc:{open:function(a){a.stream_ops=
w.Oc(a.node.rdev).stream_ops;a.stream_ops.open&&a.stream_ops.open(a)},llseek:function(){throw new w.ErrnoError(70);}},Kb:function(a){return a>>8},sd:function(a){return a&255},bb:function(a,b){return a<<8|b},Qb:function(a,b){w.Xb[a]={stream_ops:b}},Oc:function(a){return w.Xb[a]},bc:function(a){var b=[];for(a=[a];a.length;){var c=a.pop();b.push(c);a.push.apply(a,c.mb)}return b},mc:function(a,b){function c(k){w.tb--;return b(k)}function e(k){if(k){if(!e.Kc)return e.Kc=!0,c(k)}else++g>=f.length&&c(null)}
"function"===typeof a&&(b=a,a=!1);w.tb++;1<w.tb&&M("warning: "+w.tb+" FS.syncfs operations in flight at once, probably just doing extra work");var f=w.bc(w.root.mount),g=0;f.forEach(function(k){if(!k.type.mc)return e(null);k.type.mc(k,a,e)})},mount:function(a,b,c){var e="/"===c,f=!c;if(e&&w.root)throw new w.ErrnoError(10);if(!e&&!f){var g=w.lookupPath(c,{Cb:!1});c=g.path;g=g.node;if(w.ab(g))throw new w.ErrnoError(10);if(!w.isDir(g.mode))throw new w.ErrnoError(54);}b={type:a,vd:b,jc:c,mb:[]};a=a.mount(b);
a.mount=b;b.root=a;e?w.root=a:g&&(g.lb=b,g.mount&&g.mount.mb.push(b));return a},yd:function(a){a=w.lookupPath(a,{Cb:!1});if(!w.ab(a.node))throw new w.ErrnoError(28);a=a.node;var b=a.lb,c=w.bc(b);Object.keys(w.Ua).forEach(function(e){for(e=w.Ua[e];e;){var f=e.cb;c.includes(e.mount)&&w.Ab(e);e=f}});a.lb=null;a.mount.mb.splice(a.mount.mb.indexOf(b),1)},lookup:function(a,b){return a.node_ops.lookup(a,b)},mknod:function(a,b,c){var e=w.lookupPath(a,{parent:!0}).node;a=W(a);if(!a||"."===a||".."===a)throw new w.ErrnoError(28);
var f=w.Lb(e,a);if(f)throw new w.ErrnoError(f);if(!e.node_ops.mknod)throw new w.ErrnoError(63);return e.node_ops.mknod(e,a,b,c)},create:function(a,b){return w.mknod(a,(void 0!==b?b:438)&4095|32768,0)},mkdir:function(a,b){return w.mknod(a,(void 0!==b?b:511)&1023|16384,0)},td:function(a,b){a=a.split("/");for(var c="",e=0;e<a.length;++e)if(a[e]){c+="/"+a[e];try{w.mkdir(c,b)}catch(f){if(20!=f.Oa)throw f;}}},rb:function(a,b,c){"undefined"===typeof c&&(c=b,b=438);return w.mknod(a,b|8192,c)},symlink:function(a,
b){if(!sb(a))throw new w.ErrnoError(44);var c=w.lookupPath(b,{parent:!0}).node;if(!c)throw new w.ErrnoError(44);b=W(b);var e=w.Lb(c,b);if(e)throw new w.ErrnoError(e);if(!c.node_ops.symlink)throw new w.ErrnoError(63);return c.node_ops.symlink(c,b,a)},rename:function(a,b){var c=pb(a),e=pb(b),f=W(a),g=W(b);var k=w.lookupPath(a,{parent:!0});var l=k.node;k=w.lookupPath(b,{parent:!0});k=k.node;if(!l||!k)throw new w.ErrnoError(44);if(l.mount!==k.mount)throw new w.ErrnoError(75);var q=w.lookupNode(l,f);e=
tb(a,e);if("."!==e.charAt(0))throw new w.ErrnoError(28);e=tb(b,c);if("."!==e.charAt(0))throw new w.ErrnoError(55);try{var m=w.lookupNode(k,g)}catch(r){}if(q!==m){c=w.isDir(q.mode);if(f=w.qb(l,f,c))throw new w.ErrnoError(f);if(f=m?w.qb(k,g,c):w.Lb(k,g))throw new w.ErrnoError(f);if(!l.node_ops.rename)throw new w.ErrnoError(63);if(w.ab(q)||m&&w.ab(m))throw new w.ErrnoError(10);if(k!==l&&(f=w.Za(l,"w")))throw new w.ErrnoError(f);try{w.Sa.willMovePath&&w.Sa.willMovePath(a,b)}catch(r){M("FS.trackingDelegate['willMovePath']('"+
a+"', '"+b+"') threw an exception: "+r.message)}w.fc(q);try{l.node_ops.rename(q,k,g)}catch(r){throw r;}finally{w.ec(q)}try{if(w.Sa.onMovePath)w.Sa.onMovePath(a,b)}catch(r){M("FS.trackingDelegate['onMovePath']('"+a+"', '"+b+"') threw an exception: "+r.message)}}},rmdir:function(a){var b=w.lookupPath(a,{parent:!0}).node,c=W(a),e=w.lookupNode(b,c),f=w.qb(b,c,!0);if(f)throw new w.ErrnoError(f);if(!b.node_ops.rmdir)throw new w.ErrnoError(63);if(w.ab(e))throw new w.ErrnoError(10);try{w.Sa.willDeletePath&&
w.Sa.willDeletePath(a)}catch(g){M("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+g.message)}b.node_ops.rmdir(b,c);w.Ab(e);try{if(w.Sa.onDeletePath)w.Sa.onDeletePath(a)}catch(g){M("FS.trackingDelegate['onDeletePath']('"+a+"') threw an exception: "+g.message)}},readdir:function(a){a=w.lookupPath(a,{Ta:!0}).node;if(!a.node_ops.readdir)throw new w.ErrnoError(54);return a.node_ops.readdir(a)},unlink:function(a){var b=w.lookupPath(a,{parent:!0}).node,c=W(a),e=w.lookupNode(b,c),f=
w.qb(b,c,!1);if(f)throw new w.ErrnoError(f);if(!b.node_ops.unlink)throw new w.ErrnoError(63);if(w.ab(e))throw new w.ErrnoError(10);try{w.Sa.willDeletePath&&w.Sa.willDeletePath(a)}catch(g){M("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+g.message)}b.node_ops.unlink(b,c);w.Ab(e);try{if(w.Sa.onDeletePath)w.Sa.onDeletePath(a)}catch(g){M("FS.trackingDelegate['onDeletePath']('"+a+"') threw an exception: "+g.message)}},readlink:function(a){a=w.lookupPath(a).node;if(!a)throw new w.ErrnoError(44);
if(!a.node_ops.readlink)throw new w.ErrnoError(28);return sb(w.Ya(a.parent),a.node_ops.readlink(a))},stat:function(a,b){a=w.lookupPath(a,{Ta:!b}).node;if(!a)throw new w.ErrnoError(44);if(!a.node_ops.getattr)throw new w.ErrnoError(63);return a.node_ops.getattr(a)},lstat:function(a){return w.stat(a,!0)},chmod:function(a,b,c){a="string"===typeof a?w.lookupPath(a,{Ta:!c}).node:a;if(!a.node_ops.setattr)throw new w.ErrnoError(63);a.node_ops.setattr(a,{mode:b&4095|a.mode&-4096,timestamp:Date.now()})},lchmod:function(a,
b){w.chmod(a,b,!0)},fchmod:function(a,b){a=w.$a(a);if(!a)throw new w.ErrnoError(8);w.chmod(a.node,b)},chown:function(a,b,c,e){a="string"===typeof a?w.lookupPath(a,{Ta:!e}).node:a;if(!a.node_ops.setattr)throw new w.ErrnoError(63);a.node_ops.setattr(a,{timestamp:Date.now()})},lchown:function(a,b,c){w.chown(a,b,c,!0)},fchown:function(a,b,c){a=w.$a(a);if(!a)throw new w.ErrnoError(8);w.chown(a.node,b,c)},truncate:function(a,b){if(0>b)throw new w.ErrnoError(28);a="string"===typeof a?w.lookupPath(a,{Ta:!0}).node:
a;if(!a.node_ops.setattr)throw new w.ErrnoError(63);if(w.isDir(a.mode))throw new w.ErrnoError(31);if(!w.isFile(a.mode))throw new w.ErrnoError(28);var c=w.Za(a,"w");if(c)throw new w.ErrnoError(c);a.node_ops.setattr(a,{size:b,timestamp:Date.now()})},Nc:function(a,b){a=w.$a(a);if(!a)throw new w.ErrnoError(8);if(0===(a.flags&2097155))throw new w.ErrnoError(28);w.truncate(a.node,b)},kd:function(a,b,c){a=w.lookupPath(a,{Ta:!0}).node;a.node_ops.setattr(a,{timestamp:Math.max(b,c)})},open:function(a,b,c,e,
f){if(""===a)throw new w.ErrnoError(44);b="string"===typeof b?w.Yc(b):b;c=b&64?("undefined"===typeof c?438:c)&4095|32768:0;if("object"===typeof a)var g=a;else{a=ob(a);try{g=w.lookupPath(a,{Ta:!(b&131072)}).node}catch(l){}}var k=!1;if(b&64)if(g){if(b&128)throw new w.ErrnoError(20);}else g=w.mknod(a,c,0),k=!0;if(!g)throw new w.ErrnoError(44);w.pb(g.mode)&&(b&=-513);if(b&65536&&!w.isDir(g.mode))throw new w.ErrnoError(54);if(!k&&(c=w.Wc(g,b)))throw new w.ErrnoError(c);b&512&&w.truncate(g,0);b&=-131713;
e=w.Jc({node:g,path:w.Ya(g),flags:b,seekable:!0,position:0,stream_ops:g.stream_ops,jd:[],error:!1},e,f);e.stream_ops.open&&e.stream_ops.open(e);!Module.logReadFiles||b&1||(w.Ob||(w.Ob={}),a in w.Ob||(w.Ob[a]=1,M("FS.trackingDelegate error on read file: "+a)));try{w.Sa.onOpenFile&&(f=0,1!==(b&2097155)&&(f|=w.nc.kc.qc),0!==(b&2097155)&&(f|=w.nc.kc.rc),w.Sa.onOpenFile(a,f))}catch(l){M("FS.trackingDelegate['onOpenFile']('"+a+"', flags) threw an exception: "+l.message)}return e},close:function(a){if(w.kb(a))throw new w.ErrnoError(8);
a.Fb&&(a.Fb=null);try{a.stream_ops.close&&a.stream_ops.close(a)}catch(b){throw b;}finally{w.Dc(a.fd)}a.fd=null},kb:function(a){return null===a.fd},llseek:function(a,b,c){if(w.kb(a))throw new w.ErrnoError(8);if(!a.seekable||!a.stream_ops.llseek)throw new w.ErrnoError(70);if(0!=c&&1!=c&&2!=c)throw new w.ErrnoError(28);a.position=a.stream_ops.llseek(a,b,c);a.jd=[];return a.position},read:function(a,b,c,e,f){if(0>e||0>f)throw new w.ErrnoError(28);if(w.kb(a))throw new w.ErrnoError(8);if(1===(a.flags&2097155))throw new w.ErrnoError(8);
if(w.isDir(a.node.mode))throw new w.ErrnoError(31);if(!a.stream_ops.read)throw new w.ErrnoError(28);var g="undefined"!==typeof f;if(!g)f=a.position;else if(!a.seekable)throw new w.ErrnoError(70);b=a.stream_ops.read(a,b,c,e,f);g||(a.position+=b);return b},write:function(a,b,c,e,f,g){if(0>e||0>f)throw new w.ErrnoError(28);if(w.kb(a))throw new w.ErrnoError(8);if(0===(a.flags&2097155))throw new w.ErrnoError(8);if(w.isDir(a.node.mode))throw new w.ErrnoError(31);if(!a.stream_ops.write)throw new w.ErrnoError(28);
a.seekable&&a.flags&1024&&w.llseek(a,0,2);var k="undefined"!==typeof f;if(!k)f=a.position;else if(!a.seekable)throw new w.ErrnoError(70);b=a.stream_ops.write(a,b,c,e,f,g);k||(a.position+=b);try{if(a.path&&w.Sa.onWriteToFile)w.Sa.onWriteToFile(a.path)}catch(l){M("FS.trackingDelegate['onWriteToFile']('"+a.path+"') threw an exception: "+l.message)}return b},allocate:function(a,b,c){if(w.kb(a))throw new w.ErrnoError(8);if(0>b||0>=c)throw new w.ErrnoError(28);if(0===(a.flags&2097155))throw new w.ErrnoError(8);
if(!w.isFile(a.node.mode)&&!w.isDir(a.node.mode))throw new w.ErrnoError(43);if(!a.stream_ops.allocate)throw new w.ErrnoError(138);a.stream_ops.allocate(a,b,c)},mmap:function(a,b,c,e,f,g){if(0!==(f&2)&&0===(g&2)&&2!==(a.flags&2097155))throw new w.ErrnoError(2);if(1===(a.flags&2097155))throw new w.ErrnoError(2);if(!a.stream_ops.mmap)throw new w.ErrnoError(43);return a.stream_ops.mmap(a,b,c,e,f,g)},msync:function(a,b,c,e,f){return a&&a.stream_ops.msync?a.stream_ops.msync(a,b,c,e,f):0},ud:function(){return 0},
ic:function(a,b,c){if(!a.stream_ops.ic)throw new w.ErrnoError(59);return a.stream_ops.ic(a,b,c)},readFile:function(a,b){b=b||{};b.flags=b.flags||0;b.encoding=b.encoding||"binary";if("utf8"!==b.encoding&&"binary"!==b.encoding)throw Error('Invalid encoding type "'+b.encoding+'"');var c,e=w.open(a,b.flags);a=w.stat(a).size;var f=new Uint8Array(a);w.read(e,f,0,a,0);"utf8"===b.encoding?c=Na(f,0):"binary"===b.encoding&&(c=f);w.close(e);return c},writeFile:function(a,b,c){c=c||{};c.flags=c.flags||577;a=
w.open(a,c.flags,c.mode);if("string"===typeof b){var e=new Uint8Array(d(b)+1);b=p(b,e,0,e.length);w.write(a,e,0,b,void 0,c.Bc)}else if(ArrayBuffer.isView(b))w.write(a,b,0,b.byteLength,void 0,c.Bc);else throw Error("Unsupported data type");w.close(a)},cwd:function(){return w.Wb},chdir:function(a){a=w.lookupPath(a,{Ta:!0});if(null===a.node)throw new w.ErrnoError(44);if(!w.isDir(a.node.mode))throw new w.ErrnoError(54);var b=w.Za(a.node,"x");if(b)throw new w.ErrnoError(b);w.Wb=a.path},Fc:function(){w.mkdir("/tmp");
w.mkdir("/home");w.mkdir("/home/web_user")},Ec:function(){w.mkdir("/dev");w.Qb(w.bb(1,3),{read:function(){return 0},write:function(b,c,e,f){return f}});w.rb("/dev/null",w.bb(1,3));vb(w.bb(5,0),xb);vb(w.bb(6,0),yb);w.rb("/dev/tty",w.bb(5,0));w.rb("/dev/tty1",w.bb(6,0));var a=rb();w.Wa("/dev","random",a);w.Wa("/dev","urandom",a);w.mkdir("/dev/shm");w.mkdir("/dev/shm/tmp")},Hc:function(){w.mkdir("/proc");var a=w.mkdir("/proc/self");w.mkdir("/proc/self/fd");w.mount({mount:function(){var b=w.createNode(a,
"fd",16895,73);b.node_ops={lookup:function(c,e){var f=w.$a(+e);if(!f)throw new w.ErrnoError(8);c={parent:null,mount:{jc:"fake"},node_ops:{readlink:function(){return f.path}}};return c.parent=c}};return b}},{},"/proc/self/fd")},Ic:function(){Module.stdin?w.Wa("/dev","stdin",Module.stdin):w.symlink("/dev/tty","/dev/stdin");Module.stdout?w.Wa("/dev","stdout",null,Module.stdout):w.symlink("/dev/tty","/dev/stdout");Module.stderr?w.Wa("/dev","stderr",null,Module.stderr):w.symlink("/dev/tty1","/dev/stderr");
w.open("/dev/stdin",0);w.open("/dev/stdout",1);w.open("/dev/stderr",1)},Yb:function(){w.ErrnoError||(w.ErrnoError=function(a,b){this.node=b;this.hd=function(c){this.Oa=c};this.hd(a);this.message="FS error"},w.ErrnoError.prototype=Error(),w.ErrnoError.prototype.constructor=w.ErrnoError,[44].forEach(function(a){w.Db[a]=new w.ErrnoError(a);w.Db[a].stack="<generic error, no stack>"}))},lc:function(){w.Yb();w.Ua=Array(4096);w.mount(X,{},"/");w.Fc();w.Ec();w.Hc();w.Lc={MEMFS:X}},jb:function(a,b,c){w.jb.Hb=
!0;w.Yb();Module.stdin=a||Module.stdin;Module.stdout=b||Module.stdout;Module.stderr=c||Module.stderr;w.Ic()},wd:function(){w.jb.Hb=!1;var a=Module._fflush;a&&a(0);for(a=0;a<w.streams.length;a++){var b=w.streams[a];b&&w.close(b)}},Eb:function(a,b){var c=0;a&&(c|=365);b&&(c|=146);return c},od:function(a,b){a=w.xb(a,b);return a.exists?a.object:null},xb:function(a,b){try{var c=w.lookupPath(a,{Ta:!b});a=c.path}catch(f){}var e={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,ad:!1,cd:null,bd:null};
try{c=w.lookupPath(a,{parent:!0}),e.ad=!0,e.cd=c.path,e.bd=c.node,e.name=W(a),c=w.lookupPath(a,{Ta:!b}),e.exists=!0,e.path=c.path,e.object=c.node,e.name=c.node.name,e.isRoot="/"===c.path}catch(f){e.error=f.Oa}return e},md:function(a,b){a="string"===typeof a?a:w.Ya(a);for(b=b.split("/").reverse();b.length;){var c=b.pop();if(c){var e=qb(a,c);try{w.mkdir(e)}catch(f){}a=e}}return e},Gc:function(a,b,c,e,f){a=qb("string"===typeof a?a:w.Ya(a),b);return w.create(a,w.Eb(e,f))},zb:function(a,b,c,e,f,g){a=b?
qb("string"===typeof a?a:w.Ya(a),b):a;e=w.Eb(e,f);f=w.create(a,e);if(c){if("string"===typeof c){a=Array(c.length);b=0;for(var k=c.length;b<k;++b)a[b]=c.charCodeAt(b);c=a}w.chmod(f,e|146);a=w.open(f,577);w.write(a,c,0,c.length,0,g);w.close(a);w.chmod(f,e)}return f},Wa:function(a,b,c,e){a=qb("string"===typeof a?a:w.Ya(a),b);b=w.Eb(!!c,!!e);w.Wa.Kb||(w.Wa.Kb=64);var f=w.bb(w.Wa.Kb++,0);w.Qb(f,{open:function(g){g.seekable=!1},close:function(){e&&e.buffer&&e.buffer.length&&e(10)},read:function(g,k,l,q){for(var m=
0,r=0;r<q;r++){try{var x=c()}catch(B){throw new w.ErrnoError(29);}if(void 0===x&&0===m)throw new w.ErrnoError(6);if(null===x||void 0===x)break;m++;k[l+r]=x}m&&(g.node.timestamp=Date.now());return m},write:function(g,k,l,q){for(var m=0;m<q;m++)try{e(k[l+m])}catch(r){throw new w.ErrnoError(29);}q&&(g.node.timestamp=Date.now());return m}});return w.rb(a,b,f)},ac:function(a){if(a.Ib||a.Sc||a.link||a.Na)return!0;if("undefined"!==typeof XMLHttpRequest)throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
if(sa)try{a.Na=ba(sa(a.url),!0),a.Ra=a.Na.length}catch(b){throw new w.ErrnoError(29);}else throw Error("Cannot load without read() or XMLHttpRequest.");},ld:function(a,b,c,e,f){function g(){this.Jb=!1;this.ob=[]}g.prototype.get=function(m){if(!(m>this.length-1||0>m)){var r=m%this.chunkSize;return this.dc(m/this.chunkSize|0)[r]}};g.prototype.pc=function(m){this.dc=m};g.prototype.Ub=function(){var m=new XMLHttpRequest;m.open("HEAD",c,!1);m.send(null);if(!(200<=m.status&&300>m.status||304===m.status))throw Error("Couldn't load "+
c+". Status: "+m.status);var r=Number(m.getResponseHeader("Content-length")),x,B=(x=m.getResponseHeader("Accept-Ranges"))&&"bytes"===x;m=(x=m.getResponseHeader("Content-Encoding"))&&"gzip"===x;var E=1048576;B||(E=r);var A=this;A.pc(function(J){var Z=J*E,U=(J+1)*E-1;U=Math.min(U,r-1);if("undefined"===typeof A.ob[J]){var Ka=A.ob;if(Z>U)throw Error("invalid range ("+Z+", "+U+") or no bytes requested!");if(U>r-1)throw Error("only "+r+" bytes available! programmer error!");var G=new XMLHttpRequest;G.open("GET",
c,!1);r!==E&&G.setRequestHeader("Range","bytes="+Z+"-"+U);"undefined"!=typeof Uint8Array&&(G.responseType="arraybuffer");G.overrideMimeType&&G.overrideMimeType("text/plain; charset=x-user-defined");G.send(null);if(!(200<=G.status&&300>G.status||304===G.status))throw Error("Couldn't load "+c+". Status: "+G.status);Z=void 0!==G.response?new Uint8Array(G.response||[]):ba(G.responseText||"",!0);Ka[J]=Z}if("undefined"===typeof A.ob[J])throw Error("doXHR failed!");return A.ob[J]});if(m||!r)E=r=1,E=r=this.dc(0).length,
xa("LazyFiles on gzip forces download of the whole file when length is accessed");this.tc=r;this.sc=E;this.Jb=!0};if("undefined"!==typeof XMLHttpRequest){if(!pa)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var k=new g;Object.defineProperties(k,{length:{get:function(){this.Jb||this.Ub();return this.tc}},chunkSize:{get:function(){this.Jb||this.Ub();return this.sc}}});k={Ib:!1,Na:k}}else k={Ib:!1,url:c};var l=w.Gc(a,b,k,e,
f);k.Na?l.Na=k.Na:k.url&&(l.Na=null,l.url=k.url);Object.defineProperties(l,{Ra:{get:function(){return this.Na.length}}});var q={};Object.keys(l.stream_ops).forEach(function(m){var r=l.stream_ops[m];q[m]=function(){w.ac(l);return r.apply(null,arguments)}});q.read=function(m,r,x,B,E){w.ac(l);m=m.node.Na;if(E>=m.length)return 0;B=Math.min(m.length-E,B);if(m.slice)for(var A=0;A<B;A++)r[x+A]=m[E+A];else for(A=0;A<B;A++)r[x+A]=m.get(E+A);return B};l.stream_ops=q;return l},nd:function(a,b,c,e,f,g,k,l,q,
m){function r(B){function E(J){m&&m();l||w.zb(a,b,J,e,f,q);g&&g();Za()}var A=!1;Module.preloadPlugins.forEach(function(J){!A&&J.canHandle(x)&&(J.handle(B,x,E,function(){k&&k();Za()}),A=!0)});A||E(B)}Zb.jb();var x=b?sb(qb(a,b)):a;Ya();"string"==typeof c?Bb(c,function(B){r(B)},k):r(c)},indexedDB:function(){return window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB},Rb:function(){return"EM_FS_"+window.location.pathname},Sb:20,ib:"FILE_DATA",xd:function(a,b,c){b=b||function(){};
c=c||function(){};var e=w.indexedDB();try{var f=e.open(w.Rb(),w.Sb)}catch(g){return c(g)}f.onupgradeneeded=function(){xa("creating db");f.result.createObjectStore(w.ib)};f.onsuccess=function(){var g=f.result.transaction([w.ib],"readwrite"),k=g.objectStore(w.ib),l=0,q=0,m=a.length;a.forEach(function(r){r=k.put(w.xb(r).object.Na,r);r.onsuccess=function(){l++;l+q==m&&(0==q?b():c())};r.onerror=function(){q++;l+q==m&&(0==q?b():c())}});g.onerror=c};f.onerror=c},rd:function(a,b,c){b=b||function(){};c=c||
function(){};var e=w.indexedDB();try{var f=e.open(w.Rb(),w.Sb)}catch(g){return c(g)}f.onupgradeneeded=c;f.onsuccess=function(){var g=f.result;try{var k=g.transaction([w.ib],"readonly")}catch(x){c(x);return}var l=k.objectStore(w.ib),q=0,m=0,r=a.length;a.forEach(function(x){var B=l.get(x);B.onsuccess=function(){w.xb(x).exists&&w.unlink(x);w.zb(pb(x),W(x),B.result,!0,!0,!0);q++;q+m==r&&(0==m?b():c())};B.onerror=function(){m++;q+m==r&&(0==m?b():c())}});k.onerror=c};f.onerror=c}},$b={};
function ac(a,b,c){try{var e=a(b)}catch(f){if(f&&f.node&&ob(b)!==ob(w.Ya(f.node)))return-54;throw f;}Q[c>>2]=e.dev;Q[c+4>>2]=0;Q[c+8>>2]=e.ino;Q[c+12>>2]=e.mode;Q[c+16>>2]=e.nlink;Q[c+20>>2]=e.uid;Q[c+24>>2]=e.gid;Q[c+28>>2]=e.rdev;Q[c+32>>2]=0;R=[e.size>>>0,(T=e.size,1<=+Math.abs(T)?0<T?(Math.min(+Math.floor(T/4294967296),4294967295)|0)>>>0:~~+Math.ceil((T-+(~~T>>>0))/4294967296)>>>0:0)];Q[c+40>>2]=R[0];Q[c+44>>2]=R[1];Q[c+48>>2]=4096;Q[c+52>>2]=e.blocks;Q[c+56>>2]=e.atime.getTime()/1E3|0;Q[c+60>>
2]=0;Q[c+64>>2]=e.mtime.getTime()/1E3|0;Q[c+68>>2]=0;Q[c+72>>2]=e.ctime.getTime()/1E3|0;Q[c+76>>2]=0;R=[e.ino>>>0,(T=e.ino,1<=+Math.abs(T)?0<T?(Math.min(+Math.floor(T/4294967296),4294967295)|0)>>>0:~~+Math.ceil((T-+(~~T>>>0))/4294967296)>>>0:0)];Q[c+80>>2]=R[0];Q[c+84>>2]=R[1];return 0}var bc=void 0;function cc(){bc+=4;return Q[bc-4>>2]}function Y(a){a=w.$a(a);if(!a)throw new w.ErrnoError(8);return a}var dc;dc=qa?function(){var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:function(){return performance.now()};
var ec={};function fc(){if(!gc){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"===typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:na||"./this.program"},b;for(b in ec)void 0===ec[b]?delete a[b]:a[b]=ec[b];var c=[];for(b in a)c.push(b+"="+a[b]);gc=c}return gc}var gc;
function hc(a,b,c,e){a||(a=this);this.parent=a;this.mount=a.mount;this.lb=null;this.id=w.Zc++;this.name=b;this.mode=c;this.node_ops={};this.stream_ops={};this.rdev=e}Object.defineProperties(hc.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}},Sc:{get:function(){return w.isDir(this.mode)}},Ib:{get:function(){return w.pb(this.mode)}}});
w.FSNode=hc;w.lc();var Zb;function ba(a,b){var c=Array(d(a)+1);a=p(a,c,0,c.length);b&&(c.length=a);return c}
var jc={a:function(a,b,c,e){P("Assertion failed: "+F(a)+", at: "+[b?F(b):"unknown filename",c,e?F(e):"unknown function"])},u:function(a,b){ib();a=new Date(1E3*Q[a>>2]);Q[b>>2]=a.getSeconds();Q[b+4>>2]=a.getMinutes();Q[b+8>>2]=a.getHours();Q[b+12>>2]=a.getDate();Q[b+16>>2]=a.getMonth();Q[b+20>>2]=a.getFullYear()-1900;Q[b+24>>2]=a.getDay();var c=new Date(a.getFullYear(),0,1);Q[b+28>>2]=(a.getTime()-c.getTime())/864E5|0;Q[b+36>>2]=-(60*a.getTimezoneOffset());var e=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();
c=c.getTimezoneOffset();a=(e!=c&&a.getTimezoneOffset()==Math.min(c,e))|0;Q[b+32>>2]=a;a=Q[mb()+(a?4:0)>>2];Q[b+40>>2]=a;return b},m:function(a,b){try{a=F(a);if(b&-8)var c=-28;else{var e;(e=w.lookupPath(a,{Ta:!0}).node)?(a="",b&4&&(a+="r"),b&2&&(a+="w"),b&1&&(a+="x"),c=a&&w.Za(e,a)?-2:0):c=-44}return c}catch(f){return"undefined"!==typeof w&&f instanceof w.ErrnoError||P(f),-f.Oa}},A:function(a,b){try{return a=F(a),w.chmod(a,b),0}catch(c){return"undefined"!==typeof w&&c instanceof w.ErrnoError||P(c),
-c.Oa}},H:function(a,b,c){try{return a=F(a),w.chown(a,b,c),0}catch(e){return"undefined"!==typeof w&&e instanceof w.ErrnoError||P(e),-e.Oa}},B:function(a,b){try{return w.fchmod(a,b),0}catch(c){return"undefined"!==typeof w&&c instanceof w.ErrnoError||P(c),-c.Oa}},I:function(a,b,c){try{return w.fchown(a,b,c),0}catch(e){return"undefined"!==typeof w&&e instanceof w.ErrnoError||P(e),-e.Oa}},b:function(a,b,c){bc=c;try{var e=Y(a);switch(b){case 0:var f=cc();return 0>f?-28:w.open(e.path,e.flags,0,f).fd;case 1:case 2:return 0;
case 3:return e.flags;case 4:return f=cc(),e.flags|=f,0;case 12:return f=cc(),Ca[f+0>>1]=2,0;case 13:case 14:return 0;case 16:case 8:return-28;case 9:return Q[ic()>>2]=28,-1;default:return-28}}catch(g){return"undefined"!==typeof w&&g instanceof w.ErrnoError||P(g),-g.Oa}},E:function(a,b){try{var c=Y(a);return ac(w.stat,c.path,b)}catch(e){return"undefined"!==typeof w&&e instanceof w.ErrnoError||P(e),-e.Oa}},n:function(a,b,c){try{return w.Nc(a,c),0}catch(e){return"undefined"!==typeof w&&e instanceof
w.ErrnoError||P(e),-e.Oa}},l:function(a,b){try{if(0===b)return-28;var c=w.cwd();if(b<d(c)+1)return-68;p(c,u,a,b);return a}catch(e){return"undefined"!==typeof w&&e instanceof w.ErrnoError||P(e),-e.Oa}},G:function(){return 0},d:function(){return 42},z:function(a,b){try{return a=F(a),ac(w.lstat,a,b)}catch(c){return"undefined"!==typeof w&&c instanceof w.ErrnoError||P(c),-c.Oa}},C:function(a,b){try{return a=F(a),a=ob(a),"/"===a[a.length-1]&&(a=a.substr(0,a.length-1)),w.mkdir(a,b,0),0}catch(c){return"undefined"!==
typeof w&&c instanceof w.ErrnoError||P(c),-c.Oa}},y:function(a,b,c,e,f,g){try{a:{g<<=12;var k=!1;if(0!==(e&16)&&0!==a%65536)var l=-28;else{if(0!==(e&32)){var q=zb(b);if(!q){l=-48;break a}k=!0}else{var m=w.$a(f);if(!m){l=-8;break a}var r=w.mmap(m,a,b,g,c,e);q=r.ed;k=r.vb}$b[q]={Uc:q,Tc:b,vb:k,fd:f,dd:c,flags:e,offset:g};l=q}}return l}catch(x){return"undefined"!==typeof w&&x instanceof w.ErrnoError||P(x),-x.Oa}},x:function(a,b){try{var c=$b[a];if(0!==b&&c){if(b===c.Tc){var e=w.$a(c.fd);if(e&&c.dd&2){var f=
c.flags,g=c.offset,k=u.slice(a,a+b);w.msync(e,k,g,b,f)}$b[a]=null;c.vb&&da(c.Uc)}var l=0}else l=-28;return l}catch(q){return"undefined"!==typeof w&&q instanceof w.ErrnoError||P(q),-q.Oa}},w:function(a,b,c){bc=c;try{var e=F(a),f=c?cc():0;return w.open(e,b,f).fd}catch(g){return"undefined"!==typeof w&&g instanceof w.ErrnoError||P(g),-g.Oa}},J:function(a,b,c){try{a=F(a);if(0>=c)var e=-28;else{var f=w.readlink(a),g=Math.min(c,d(f)),k=D[b+g];p(f,u,b,c+1);D[b+g]=k;e=g}return e}catch(l){return"undefined"!==
typeof w&&l instanceof w.ErrnoError||P(l),-l.Oa}},F:function(a){try{return a=F(a),w.rmdir(a),0}catch(b){return"undefined"!==typeof w&&b instanceof w.ErrnoError||P(b),-b.Oa}},e:function(a,b){try{return a=F(a),ac(w.stat,a,b)}catch(c){return"undefined"!==typeof w&&c instanceof w.ErrnoError||P(c),-c.Oa}},i:function(a){try{return a=F(a),w.unlink(a),0}catch(b){return"undefined"!==typeof w&&b instanceof w.ErrnoError||P(b),-b.Oa}},v:function(){return 2147483648},p:function(a,b,c){u.copyWithin(a,b,b+c)},c:function(a){var b=
u.length;a>>>=0;if(2147483648<a)return!1;for(var c=1;4>=c;c*=2){var e=b*(1+.2/c);e=Math.min(e,a+100663296);e=Math.max(a,e);0<e%65536&&(e+=65536-e%65536);a:{try{Fa.grow(Math.min(2147483648,e)-Pa.byteLength+65535>>>16);Qa();var f=1;break a}catch(g){}f=void 0}if(f)return!0}return!1},t:function(a){for(var b=dc();dc()-b<a;);},r:function(a,b){try{var c=0;fc().forEach(function(e,f){var g=b+c;f=Q[a+4*f>>2]=g;for(g=0;g<e.length;++g)D[f++>>0]=e.charCodeAt(g);D[f>>0]=0;c+=e.length+1});return 0}catch(e){return"undefined"!==
typeof w&&e instanceof w.ErrnoError||P(e),e.Oa}},s:function(a,b){try{var c=fc();Q[a>>2]=c.length;var e=0;c.forEach(function(f){e+=f.length+1});Q[b>>2]=e;return 0}catch(f){return"undefined"!==typeof w&&f instanceof w.ErrnoError||P(f),f.Oa}},f:function(a){try{var b=Y(a);w.close(b);return 0}catch(c){return"undefined"!==typeof w&&c instanceof w.ErrnoError||P(c),c.Oa}},q:function(a,b){try{var c=Y(a),e=c.tty?2:w.isDir(c.mode)?3:w.fb(c.mode)?7:4;D[b>>0]=e;return 0}catch(f){return"undefined"!==typeof w&&
f instanceof w.ErrnoError||P(f),f.Oa}},j:function(a,b,c,e){try{a:{for(var f=Y(a),g=a=0;g<c;g++){var k=Q[b+(8*g+4)>>2],l=w.read(f,D,Q[b+8*g>>2],k,void 0);if(0>l){var q=-1;break a}a+=l;if(l<k)break}q=a}Q[e>>2]=q;return 0}catch(m){return"undefined"!==typeof w&&m instanceof w.ErrnoError||P(m),m.Oa}},o:function(a,b,c,e,f){try{var g=Y(a);a=4294967296*c+(b>>>0);if(-9007199254740992>=a||9007199254740992<=a)return-61;w.llseek(g,a,e);R=[g.position>>>0,(T=g.position,1<=+Math.abs(T)?0<T?(Math.min(+Math.floor(T/
4294967296),4294967295)|0)>>>0:~~+Math.ceil((T-+(~~T>>>0))/4294967296)>>>0:0)];Q[f>>2]=R[0];Q[f+4>>2]=R[1];g.Fb&&0===a&&0===e&&(g.Fb=null);return 0}catch(k){return"undefined"!==typeof w&&k instanceof w.ErrnoError||P(k),k.Oa}},k:function(a){try{var b=Y(a);return b.stream_ops&&b.stream_ops.fsync?-b.stream_ops.fsync(b):0}catch(c){return"undefined"!==typeof w&&c instanceof w.ErrnoError||P(c),c.Oa}},g:function(a,b,c,e){try{a:{for(var f=Y(a),g=a=0;g<c;g++){var k=w.write(f,D,Q[b+8*g>>2],Q[b+(8*g+4)>>2],
void 0);if(0>k){var l=-1;break a}a+=k}l=a}Q[e>>2]=l;return 0}catch(q){return"undefined"!==typeof w&&q instanceof w.ErrnoError||P(q),q.Oa}},h:function(a){var b=Date.now();Q[a>>2]=b/1E3|0;Q[a+4>>2]=b%1E3*1E3|0;return 0},K:function(a){var b=Date.now()/1E3|0;a&&(Q[a>>2]=b);return b},D:function(a,b){if(b){var c=b+8;b=1E3*Q[c>>2];b+=Q[c+4>>2]/1E3}else b=Date.now();a=F(a);try{w.kd(a,b,b);var e=0}catch(f){if(!(f instanceof w.ErrnoError)){b:{e=Error();if(!e.stack){try{throw Error();}catch(g){e=g}if(!e.stack){e=
"(no stack trace available)";break b}}e=e.stack.toString()}Module.extraStackTrace&&(e+="\n"+Module.extraStackTrace());e=hb(e);throw f+" : "+e;}e=f.Oa;Q[ic()>>2]=e;e=-1}return e}};
(function(){function a(f){Module.asm=f.exports;Fa=Module.asm.L;Qa();O=Module.asm.Da;Sa.unshift(Module.asm.M);Za()}function b(f){a(f.instance)}function c(f){return cb().then(function(g){return WebAssembly.instantiate(g,e)}).then(f,function(g){M("failed to asynchronously prepare wasm: "+g);P(g)})}var e={a:jc};Ya();if(Module.instantiateWasm)try{return Module.instantiateWasm(e,a)}catch(f){return M("Module.instantiateWasm callback failed with error: "+f),!1}(function(){return Ba||"function"!==typeof WebAssembly.instantiateStreaming||
$a()||V.startsWith("file://")||"function"!==typeof fetch?c(b):fetch(V,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,e).then(b,function(g){M("wasm streaming compile failed: "+g);M("falling back to ArrayBuffer instantiation");return c(b)})})})();return{}})();Module.___wasm_call_ctors=function(){return(Module.___wasm_call_ctors=Module.asm.M).apply(null,arguments)};Module._sqlite3_vfs_find=function(){return(Module._sqlite3_vfs_find=Module.asm.N).apply(null,arguments)};
Module._sqlite3_free=function(){return(Module._sqlite3_free=Module.asm.O).apply(null,arguments)};var ic=Module.___errno_location=function(){return(ic=Module.___errno_location=Module.asm.P).apply(null,arguments)};Module._sqlite3_finalize=function(){return(Module._sqlite3_finalize=Module.asm.Q).apply(null,arguments)};Module._sqlite3_reset=function(){return(Module._sqlite3_reset=Module.asm.R).apply(null,arguments)};
Module._sqlite3_clear_bindings=function(){return(Module._sqlite3_clear_bindings=Module.asm.S).apply(null,arguments)};Module._sqlite3_value_blob=function(){return(Module._sqlite3_value_blob=Module.asm.T).apply(null,arguments)};Module._sqlite3_value_text=function(){return(Module._sqlite3_value_text=Module.asm.U).apply(null,arguments)};Module._sqlite3_value_bytes=function(){return(Module._sqlite3_value_bytes=Module.asm.V).apply(null,arguments)};
Module._sqlite3_value_double=function(){return(Module._sqlite3_value_double=Module.asm.W).apply(null,arguments)};Module._sqlite3_value_int=function(){return(Module._sqlite3_value_int=Module.asm.X).apply(null,arguments)};Module._sqlite3_value_type=function(){return(Module._sqlite3_value_type=Module.asm.Y).apply(null,arguments)};Module._sqlite3_result_blob=function(){return(Module._sqlite3_result_blob=Module.asm.Z).apply(null,arguments)};
Module._sqlite3_result_double=function(){return(Module._sqlite3_result_double=Module.asm._).apply(null,arguments)};Module._sqlite3_result_error=function(){return(Module._sqlite3_result_error=Module.asm.$).apply(null,arguments)};Module._sqlite3_result_int=function(){return(Module._sqlite3_result_int=Module.asm.aa).apply(null,arguments)};Module._sqlite3_result_int64=function(){return(Module._sqlite3_result_int64=Module.asm.ba).apply(null,arguments)};
Module._sqlite3_result_null=function(){return(Module._sqlite3_result_null=Module.asm.ca).apply(null,arguments)};Module._sqlite3_result_text=function(){return(Module._sqlite3_result_text=Module.asm.da).apply(null,arguments)};Module._sqlite3_step=function(){return(Module._sqlite3_step=Module.asm.ea).apply(null,arguments)};Module._sqlite3_column_count=function(){return(Module._sqlite3_column_count=Module.asm.fa).apply(null,arguments)};
Module._sqlite3_data_count=function(){return(Module._sqlite3_data_count=Module.asm.ga).apply(null,arguments)};Module._sqlite3_column_blob=function(){return(Module._sqlite3_column_blob=Module.asm.ha).apply(null,arguments)};Module._sqlite3_column_bytes=function(){return(Module._sqlite3_column_bytes=Module.asm.ia).apply(null,arguments)};Module._sqlite3_column_double=function(){return(Module._sqlite3_column_double=Module.asm.ja).apply(null,arguments)};
Module._sqlite3_column_text=function(){return(Module._sqlite3_column_text=Module.asm.ka).apply(null,arguments)};Module._sqlite3_column_type=function(){return(Module._sqlite3_column_type=Module.asm.la).apply(null,arguments)};Module._sqlite3_column_name=function(){return(Module._sqlite3_column_name=Module.asm.ma).apply(null,arguments)};Module._sqlite3_bind_blob=function(){return(Module._sqlite3_bind_blob=Module.asm.na).apply(null,arguments)};
Module._sqlite3_bind_double=function(){return(Module._sqlite3_bind_double=Module.asm.oa).apply(null,arguments)};Module._sqlite3_bind_int=function(){return(Module._sqlite3_bind_int=Module.asm.pa).apply(null,arguments)};Module._sqlite3_bind_text=function(){return(Module._sqlite3_bind_text=Module.asm.qa).apply(null,arguments)};Module._sqlite3_bind_parameter_index=function(){return(Module._sqlite3_bind_parameter_index=Module.asm.ra).apply(null,arguments)};
Module._sqlite3_sql=function(){return(Module._sqlite3_sql=Module.asm.sa).apply(null,arguments)};Module._sqlite3_normalized_sql=function(){return(Module._sqlite3_normalized_sql=Module.asm.ta).apply(null,arguments)};Module._sqlite3_errmsg=function(){return(Module._sqlite3_errmsg=Module.asm.ua).apply(null,arguments)};Module._sqlite3_exec=function(){return(Module._sqlite3_exec=Module.asm.va).apply(null,arguments)};
Module._sqlite3_prepare_v2=function(){return(Module._sqlite3_prepare_v2=Module.asm.wa).apply(null,arguments)};Module._sqlite3_changes=function(){return(Module._sqlite3_changes=Module.asm.xa).apply(null,arguments)};Module._sqlite3_close_v2=function(){return(Module._sqlite3_close_v2=Module.asm.ya).apply(null,arguments)};Module._sqlite3_create_function_v2=function(){return(Module._sqlite3_create_function_v2=Module.asm.za).apply(null,arguments)};
Module._sqlite3_open=function(){return(Module._sqlite3_open=Module.asm.Aa).apply(null,arguments)};var aa=Module._malloc=function(){return(aa=Module._malloc=Module.asm.Ba).apply(null,arguments)},da=Module._free=function(){return(da=Module._free=Module.asm.Ca).apply(null,arguments)};Module._RegisterExtensionFunctions=function(){return(Module._RegisterExtensionFunctions=Module.asm.Ea).apply(null,arguments)};
Module._register_for_idb=function(){return(Module._register_for_idb=Module.asm.Fa).apply(null,arguments)};
var mb=Module.__get_tzname=function(){return(mb=Module.__get_tzname=Module.asm.Ga).apply(null,arguments)},lb=Module.__get_daylight=function(){return(lb=Module.__get_daylight=Module.asm.Ha).apply(null,arguments)},kb=Module.__get_timezone=function(){return(kb=Module.__get_timezone=Module.asm.Ia).apply(null,arguments)},ha=Module.stackSave=function(){return(ha=Module.stackSave=Module.asm.Ja).apply(null,arguments)},ja=Module.stackRestore=function(){return(ja=Module.stackRestore=Module.asm.Ka).apply(null,
arguments)},C=Module.stackAlloc=function(){return(C=Module.stackAlloc=Module.asm.La).apply(null,arguments)},Ab=Module._memalign=function(){return(Ab=Module._memalign=Module.asm.Ma).apply(null,arguments)};Module.cwrap=function(a,b,c,e){c=c||[];var f=c.every(function(g){return"number"===g});return"string"!==b&&f&&!e?Ha(a):function(){return Ia(a,b,c,arguments)}};Module.UTF8ToString=F;Module.FS=w;Module.stackSave=ha;Module.stackRestore=ja;Module.stackAlloc=C;var kc;Xa=function lc(){kc||mc();kc||(Xa=lc)};
function mc(){function a(){if(!kc&&(kc=!0,Module.calledRun=!0,!Ga)){Module.noFSInit||w.jb.Hb||w.jb();w.hc=!1;gb(Sa);if(Module.onRuntimeInitialized)Module.onRuntimeInitialized();if(Module.postRun)for("function"==typeof Module.postRun&&(Module.postRun=[Module.postRun]);Module.postRun.length;){var b=Module.postRun.shift();Ta.unshift(b)}gb(Ta)}}if(!(0<Va)){if(Module.preRun)for("function"==typeof Module.preRun&&(Module.preRun=[Module.preRun]);Module.preRun.length;)Ua();gb(Ra);0<Va||(Module.setStatus?(Module.setStatus("Running..."),
setTimeout(function(){setTimeout(function(){Module.setStatus("")},1);a()},1)):a())}}Module.run=mc;if(Module.preInit)for("function"==typeof Module.preInit&&(Module.preInit=[Module.preInit]);0<Module.preInit.length;)Module.preInit.pop()();mc();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (true){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports["default"] = initSqlJs;
}
else {}


/***/ }),

/***/ 74:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 994:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 21:
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".service-worker.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "@braudel/webextension-chrome:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_braudel_webextension_chrome"] = self["webpackChunk_braudel_webextension_chrome"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/@jlongster/sql.js/dist/sql-wasm.js
var sql_wasm = __webpack_require__(298);
var sql_wasm_default = /*#__PURE__*/__webpack_require__.n(sql_wasm);
;// CONCATENATED MODULE: ./node_modules/absurd-sql/dist/index.js
const ERRNO_CODES = {
  EPERM: 63,
  ENOENT: 44
};

// This implements an emscripten-compatible filesystem that is means
// to be mounted to the one from `sql.js`. Example:
//
// let BFS = new SQLiteFS(SQL.FS, idbBackend);
// SQL.FS.mount(BFS, {}, '/blocked');
//
// Now any files created under '/blocked' will be handled by this
// filesystem, which creates a special file that handles read/writes
// in the way that we want.
class SQLiteFS$1 {
  constructor(FS, backend) {
    this.FS = FS;
    this.backend = backend;

    this.node_ops = {
      getattr: node => {
        let fileattr = FS.isFile(node.mode) ? node.contents.getattr() : null;

        let attr = {};
        attr.dev = 1;
        attr.ino = node.id;
        attr.mode = fileattr ? fileattr.mode : node.mode;
        attr.nlink = 1;
        attr.uid = 0;
        attr.gid = 0;
        attr.rdev = node.rdev;
        attr.size = fileattr ? fileattr.size : FS.isDir(node.mode) ? 4096 : 0;
        attr.atime = new Date(0);
        attr.mtime = new Date(0);
        attr.ctime = new Date(0);
        attr.blksize = fileattr ? fileattr.blockSize : 4096;
        attr.blocks = Math.ceil(attr.size / attr.blksize);
        return attr;
      },
      setattr: (node, attr) => {
        if (this.FS.isFile(node.mode)) {
          node.contents.setattr(attr);
        } else {
          if (attr.mode != null) {
            node.mode = attr.mode;
          }
          if (attr.size != null) {
            node.size = attr.size;
          }
        }
      },
      lookup: (parent, name) => {
        throw new this.FS.ErrnoError(ERRNO_CODES.ENOENT);
      },
      mknod: (parent, name, mode, dev) => {
        if (name.endsWith('.lock')) {
          throw new Error('Locking via lockfiles is not supported');
        }

        return this.createNode(parent, name, mode, dev);
      },
      rename: (old_node, new_dir, new_name) => {
        throw new Error('rename not implemented');
      },
      unlink: (parent, name) => {
        let node = this.FS.lookupNode(parent, name);
        node.contents.delete(name);
      },
      readdir: node => {
        // We could list all the available databases here if `node` is
        // the root directory. However Firefox does not implemented
        // such a methods. Other browsers do, but since it's not
        // supported on all browsers users will need to track it
        // separate anyway right now

        throw new Error('readdir not implemented');
      },
      symlink: (parent, newname, oldpath) => {
        throw new Error('symlink not implemented');
      },
      readlink: node => {
        throw new Error('symlink not implemented');
      }
    };

    this.stream_ops = {
      open: stream => {
        if (this.FS.isFile(stream.node.mode)) {
          stream.node.contents.open();
        }
      },

      close: stream => {
        if (this.FS.isFile(stream.node.mode)) {
          stream.node.contents.close();
        }
      },

      read: (stream, buffer, offset, length, position) => {
        // console.log('read', offset, length, position)
        return stream.node.contents.read(buffer, offset, length, position);
      },

      write: (stream, buffer, offset, length, position) => {
        // console.log('write', offset, length, position);
        return stream.node.contents.write(buffer, offset, length, position);
      },

      llseek: (stream, offset, whence) => {
        // Copied from MEMFS
        var position = offset;
        if (whence === 1) {
          position += stream.position;
        } else if (whence === 2) {
          if (FS.isFile(stream.node.mode)) {
            position += stream.node.contents.getattr().size;
          }
        }
        if (position < 0) {
          throw new this.FS.ErrnoError(28);
        }
        return position;
      },
      allocate: (stream, offset, length) => {
        stream.node.contents.setattr({ size: offset + length });
      },
      mmap: (stream, address, length, position, prot, flags) => {
        throw new Error('mmap not implemented');
      },
      msync: (stream, buffer, offset, length, mmapFlags) => {
        throw new Error('msync not implemented');
      },
      fsync: (stream, buffer, offset, length, mmapFlags) => {
        stream.node.contents.fsync();
      }
    };
  }

  mount() {
    return this.createNode(null, '/', 16384 /* dir */ | 511 /* 0777 */, 0);
  }

  lock(path, lockType) {
    let { node } = this.FS.lookupPath(path);
    return node.contents.lock(lockType);
  }

  unlock(path, lockType) {
    let { node } = this.FS.lookupPath(path);
    return node.contents.unlock(lockType);
  }

  createNode(parent, name, mode, dev) {
    // Only files and directories supported
    if (!(this.FS.isDir(mode) || this.FS.isFile(mode))) {
      throw new this.FS.ErrnoError(ERRNO_CODES.EPERM);
    }

    var node = this.FS.createNode(parent, name, mode, dev);
    if (this.FS.isDir(node.mode)) {
      node.node_ops = {
        mknod: this.node_ops.mknod,
        lookup: this.node_ops.lookup,
        unlink: this.node_ops.unlink,
        setattr: this.node_ops.setattr
      };
      node.stream_ops = {};
      node.contents = {};
    } else if (this.FS.isFile(node.mode)) {
      node.node_ops = this.node_ops;
      node.stream_ops = this.stream_ops;

      // Create file!
      node.contents = this.backend.createFile(name);
    }

    // add the new node to the parent
    if (parent) {
      parent.contents[name] = node;
      parent.timestamp = node.timestamp;
    }

    return node;
  }
}

// Right now we don't support `export from` so we do this manually
const SQLiteFS = SQLiteFS$1;



;// CONCATENATED MODULE: ./node_modules/absurd-sql/dist/indexeddb-backend.js
let LOCK_TYPES = {
  NONE: 0,
  SHARED: 1,
  RESERVED: 2,
  PENDING: 3,
  EXCLUSIVE: 4
};

function getPageSize(bufferView) {
  // See 1.3.2 on https://www.sqlite.org/fileformat.html The page size
  // is stored as a 2 byte integer at the 16th byte. It's stored as
  // big-endian so the first byte is the larger one. Combine it into a
  // single integer.
  let int1 = bufferView[16];
  let int2 = bufferView[17];
  return (int1 << 8) + int2;
}

function isSafeToWrite(localData, diskData) {
  if (localData != null && diskData != null) {
    let localView = new Uint8Array(localData);
    let diskView = new Uint8Array(diskData);

    // See
    // https://github.com/sqlite/sqlite/blob/master/src/pager.c#L93-L96
    // (might be documented somewhere? I didn't see it this clearly in
    // the docs). At least one of these bytes change when sqlite3 writes
    // data. We can check this against our in-memory data to see if it's
    // safe to write (if something changes underneath us, it's not)
    for (let i = 24; i < 40; i++) {
      if (localView[i] !== diskView[i]) {
        return false;
      }
    }
    return true;
  }

  // One of them is null, so it's only safe if to write if both are
  // null, otherwise they are different
  return localData == null && diskData == null;
}

function range(start, end, step) {
  let r = [];
  for (let i = start; i <= end; i += step) {
    r.push(i);
  }
  return r;
}

function getBoundaryIndexes(blockSize, start, end) {
  let startC = start - (start % blockSize);
  let endC = end - 1 - ((end - 1) % blockSize);

  return range(startC, endC, blockSize);
}

function readChunks(chunks, start, end) {
  let buffer = new ArrayBuffer(end - start);
  let bufferView = new Uint8Array(buffer);
  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];

    // TODO: jest has a bug where we can't do `instanceof ArrayBuffer`
    if (chunk.data.constructor.name !== 'ArrayBuffer') {
      throw new Error('Chunk data is not an ArrayBuffer');
    }

    let cstart = 0;
    let cend = chunk.data.byteLength;

    if (start > chunk.pos) {
      cstart = start - chunk.pos;
    }
    if (end < chunk.pos + chunk.data.byteLength) {
      cend = end - chunk.pos;
    }

    if (cstart > chunk.data.byteLength || cend < 0) {
      continue;
    }

    let len = cend - cstart;

    bufferView.set(
      new Uint8Array(chunk.data, cstart, len),
      chunk.pos - start + cstart
    );
  }

  return buffer;
}

function writeChunks(bufferView, blockSize, start, end) {
  let indexes = getBoundaryIndexes(blockSize, start, end);
  let cursor = 0;

  return indexes
    .map(index => {
      let cstart = 0;
      let cend = blockSize;
      if (start > index && start < index + blockSize) {
        cstart = start - index;
      }
      if (end > index && end < index + blockSize) {
        cend = end - index;
      }

      let len = cend - cstart;
      let chunkBuffer = new ArrayBuffer(blockSize);

      if (start > index + blockSize || end <= index) {
        return null;
      }

      let off = bufferView.byteOffset + cursor;

      let available = bufferView.buffer.byteLength - off;
      if (available <= 0) {
        return null;
      }

      let readLength = Math.min(len, available);

      new Uint8Array(chunkBuffer).set(
        new Uint8Array(bufferView.buffer, off, readLength),
        cstart
      );
      cursor += readLength;

      return {
        pos: index,
        data: chunkBuffer,
        offset: cstart,
        length: readLength
      };
    })
    .filter(Boolean);
}

class File {
  constructor(filename, ops, meta = null) {
    this.filename = filename;
    this.buffer = new Map();
    this.ops = ops;
    this.meta = meta;
    this._metaDirty = false;
    this.writeLock = false;
    this.openHandles = 0;
  }

  bufferChunks(chunks) {
    for (let i = 0; i < chunks.length; i++) {
      let chunk = chunks[i];
      this.buffer.set(chunk.pos, chunk);
    }
  }

  open() {
    this.openHandles++;

    // Don't open the file again if it's already open
    if (this.openHandles === 1) {
      this.ops.open();
      let meta = this.ops.readMeta();

      // It's possible that `setattr` has already been called if opening
      // the file in a mode that truncates it to 0
      if (this.meta == null) {
        if (meta == null) {
          // New file

          meta = { size: 0 };
        }

        this.meta = meta;
      }
    }

    return this.meta;
  }

  close() {
    this.fsync();

    this.openHandles = Math.max(this.openHandles - 1, 0);

    // Only close it if there are no existing open handles
    if (this.openHandles === 0) {
      this.ops.close();
    }
  }

  delete() {
    this.ops.delete();
  }

  load(indexes) {
    let status = indexes.reduce(
      (acc, b) => {
        let inMemory = this.buffer.get(b);
        if (inMemory) {
          acc.chunks.push(inMemory);
        } else {
          acc.missing.push(b);
        }
        return acc;
      },
      { chunks: [], missing: [] }
    );

    let missingChunks = [];
    if (status.missing.length > 0) {
      missingChunks = this.ops.readBlocks(status.missing, this.meta.blockSize);
    }
    return status.chunks.concat(missingChunks);
  }

  read(bufferView, offset, length, position) {
    // console.log('reading', this.filename, offset, length, position);
    let buffer = bufferView.buffer;

    if (length <= 0) {
      return 0;
    }
    if (position < 0) {
      // TODO: is this right?
      return 0;
    }
    if (position >= this.meta.size) {
      let view = new Uint8Array(buffer, offset);
      for (let i = 0; i < length; i++) {
        view[i] = 0;
      }

      return length;
    }

    position = Math.max(position, 0);
    let dataLength = Math.min(length, this.meta.size - position);

    let start = position;
    let end = position + dataLength;

    let indexes = getBoundaryIndexes(this.meta.blockSize, start, end);

    let chunks = this.load(indexes);
    let readBuffer = readChunks(chunks, start, end);

    if (buffer.byteLength - offset < readBuffer.byteLength) {
      throw new Error('Buffer given to `read` is too small');
    }
    let view = new Uint8Array(buffer);
    view.set(new Uint8Array(readBuffer), offset);

    // TODO: I don't need to do this. `unixRead` does this for us.
    for (let i = dataLength; i < length; i++) {
      view[offset + i] = 0;
    }

    return length;
  }

  write(bufferView, offset, length, position) {
    // console.log('writing', this.filename, offset, length, position);

    if (this.meta.blockSize == null) {
      // We don't have a block size yet (an empty file). The first
      // write MUST be the beginning of the file. This is a new file
      // and the first block contains the page size which we need.
      // sqlite will write this block first, and if you are directly
      // writing a db file to disk you can't write random parts of it.
      // Just write the whole thing and we'll get the first block
      // first.

      let pageSize = getPageSize(
        new Uint8Array(bufferView.buffer, bufferView.byteOffset + offset)
      );

      // Page sizes must be a power of 2 between 512 and 65536.
      // These was generated by doing `Math.pow(2, N)` where N >= 9
      // and N <= 16.
      if (
        ![512, 1024, 2048, 4096, 8192, 16384, 32768, 65536].includes(pageSize)
      ) {
        throw new Error(
          'File has invalid page size. (the first block of a new file must be written first)'
        );
      }

      this.setattr({ blockSize: pageSize });
    }

    let buffer = bufferView.buffer;

    if (length <= 0) {
      return 0;
    }
    if (position < 0) {
      return 0;
    }
    if (buffer.byteLength === 0) {
      return 0;
    }

    length = Math.min(length, buffer.byteLength - offset);

    let writes = writeChunks(
      new Uint8Array(buffer, offset, length),
      this.meta.blockSize,
      position,
      position + length
    );

    // Find any partial chunks and read them in and merge with
    // existing data
    let { partialWrites, fullWrites } = writes.reduce(
      (state, write) => {
        if (write.length !== this.meta.blockSize) {
          state.partialWrites.push(write);
        } else {
          state.fullWrites.push({
            pos: write.pos,
            data: write.data
          });
        }
        return state;
      },
      { fullWrites: [], partialWrites: [] }
    );

    let reads = [];
    if (partialWrites.length > 0) {
      reads = this.load(partialWrites.map(w => w.pos));
    }

    let allWrites = fullWrites.concat(
      reads.map(read => {
        let write = partialWrites.find(w => w.pos === read.pos);

        // MuTatIoN!
        new Uint8Array(read.data).set(
          new Uint8Array(write.data, write.offset, write.length),
          write.offset,
          write.length
        );

        return read;
      })
    );

    this.bufferChunks(allWrites);

    if (position + length > this.meta.size) {
      this.setattr({ size: position + length });
    }

    return length;
  }

  async readIfFallback() {
    if (this.ops.readIfFallback) {
      // Reset the meta
      let meta = await this.ops.readIfFallback();
      this.meta = meta || { size: 0 };
    }
  }

  lock(lockType) {
    // TODO: Perf APIs need improvement
    if (!this._recordingLock) {
      this._recordingLock = true;
    }

    if (this.ops.lock(lockType)) {
      if (lockType >= LOCK_TYPES.RESERVED) {
        this.writeLock = true;
      }
      return true;
    }
    return false;
  }

  unlock(lockType) {
    if (lockType === 0) {
      this._recordingLock = false;
    }

    if (this.writeLock) {
      // In certain cases (I saw this while running VACUUM after
      // changing page size) sqlite changes the size of the file
      // _after_ `fsync` for some reason. In our case, this is
      // critical because we are relying on fsync to write everything
      // out. If we just did some writes, do another fsync which will
      // check the meta and make sure it's persisted if dirty (all
      // other writes should already be flushed by now)
      this.fsync();
      this.writeLock = false;
    }

    return this.ops.unlock(lockType);
  }

  fsync() {
    if (this.buffer.size > 0) {
      // We need to handle page size changes which restructures the
      // whole db. We check if the page size is being written and
      // handle it
      let first = this.buffer.get(0);
      if (first) {
        let pageSize = getPageSize(new Uint8Array(first.data));

        if (pageSize !== this.meta.blockSize) {
          // The page size changed! We need to reflect that in our
          // storage. We need to restructure all pending writes and
          // change our page size so all future writes reflect the new
          // size.
          let buffer = this.buffer;
          this.buffer = new Map();

          // We take all pending writes, concat them into a single
          // buffer, and rewrite it out with the new size. This would
          // be dangerous if the page size could be changed at any
          // point in time since we don't handle partial reads here.
          // However sqlite only ever actually changes the page size
          // in 2 cases:
          //
          // * The db is empty (no data yet, so nothing to read)
          // * A VACUUM command is rewriting the entire db
          //
          // In both cases, we can assume we have _all_ the needed
          // data in the pending buffer, and we don't have to worry
          // about overwriting anything.

          let writes = [...buffer.values()];
          let totalSize = writes.length * this.meta.blockSize;
          let buf = new ArrayBuffer(totalSize);
          let view = new Uint8Array(buf);

          for (let write of writes) {
            view.set(new Uint8Array(write.data), write.pos);
          }

          // Rewrite the buffer with the new page size
          this.bufferChunks(writeChunks(view, pageSize, 0, totalSize));

          // Change our page size
          this.setattr({ blockSize: pageSize });
        }
      }

      this.ops.writeBlocks([...this.buffer.values()], this.meta.blockSize);
    }

    if (this._metaDirty) {
      // We only store the size right now. Block size is already
      // stored in the sqlite file and we don't need the rest
      //
      // TODO: Currently we don't delete any extra blocks after the
      // end of the file. This isn't super important, and in fact
      // could cause perf regressions (sqlite doesn't compress files
      // either!) but what we probably should do is detect a VACUUM
      // command (the whole db is being rewritten) and at that point
      // delete anything after the end of the file
      this.ops.writeMeta({ size: this.meta.size });
      this._metaDirty = false;
    }

    this.buffer = new Map();
  }

  setattr(attr) {
    if (this.meta == null) {
      this.meta = {};
    }

    // Size is the only attribute we actually persist. The rest are
    // stored in memory

    if (attr.mode !== undefined) {
      this.meta.mode = attr.mode;
    }

    if (attr.blockSize !== undefined) {
      this.meta.blockSize = attr.blockSize;
    }

    if (attr.size !== undefined) {
      this.meta.size = attr.size;
      this._metaDirty = true;
    }
  }

  getattr() {
    return this.meta;
  }
}

let FINALIZED = 0xdeadbeef;

let WRITEABLE = 0;
let READABLE = 1;

class Reader {
  constructor(
    buffer,
    { initialOffset = 4, useAtomics = true, stream = true, debug, name } = {}
  ) {
    this.buffer = buffer;
    this.atomicView = new Int32Array(buffer);
    this.offset = initialOffset;
    this.useAtomics = useAtomics;
    this.stream = stream;
    this.debug = debug;
    this.name = name;
  }

  log(...args) {
    if (this.debug) {
      console.log(`[reader: ${this.name}]`, ...args);
    }
  }

  waitWrite(name, timeout = null) {
    if (this.useAtomics) {
      this.log(`waiting for ${name}`);

      while (Atomics.load(this.atomicView, 0) === WRITEABLE) {
        if (timeout != null) {
          if (
            Atomics.wait(this.atomicView, 0, WRITEABLE, timeout) === 'timed-out'
          ) {
            throw new Error('timeout');
          }
        }

        Atomics.wait(this.atomicView, 0, WRITEABLE, 500);
      }

      this.log(`resumed for ${name}`);
    } else {
      if (this.atomicView[0] !== READABLE) {
        throw new Error('`waitWrite` expected array to be readable');
      }
    }
  }

  flip() {
    this.log('flip');
    if (this.useAtomics) {
      let prev = Atomics.compareExchange(
        this.atomicView,
        0,
        READABLE,
        WRITEABLE
      );

      if (prev !== READABLE) {
        throw new Error('Read data out of sync! This is disastrous');
      }

      Atomics.notify(this.atomicView, 0);
    } else {
      this.atomicView[0] = WRITEABLE;
    }

    this.offset = 4;
  }

  done() {
    this.waitWrite('done');

    let dataView = new DataView(this.buffer, this.offset);
    let done = dataView.getUint32(0) === FINALIZED;

    if (done) {
      this.log('done');
      this.flip();
    }

    return done;
  }

  peek(fn) {
    this.peekOffset = this.offset;
    let res = fn();
    this.offset = this.peekOffset;
    this.peekOffset = null;
    return res;
  }

  string(timeout) {
    this.waitWrite('string', timeout);

    let byteLength = this._int32();
    let length = byteLength / 2;

    let dataView = new DataView(this.buffer, this.offset, byteLength);
    let chars = [];
    for (let i = 0; i < length; i++) {
      chars.push(dataView.getUint16(i * 2));
    }
    let str = String.fromCharCode.apply(null, chars);
    this.log('string', str);

    this.offset += byteLength;

    if (this.peekOffset == null) {
      this.flip();
    }
    return str;
  }

  _int32() {
    let byteLength = 4;

    let dataView = new DataView(this.buffer, this.offset);
    let num = dataView.getInt32();
    this.log('_int32', num);

    this.offset += byteLength;
    return num;
  }

  int32() {
    this.waitWrite('int32');
    let num = this._int32();
    this.log('int32', num);

    if (this.peekOffset == null) {
      this.flip();
    }
    return num;
  }

  bytes() {
    this.waitWrite('bytes');

    let byteLength = this._int32();

    let bytes = new ArrayBuffer(byteLength);
    new Uint8Array(bytes).set(
      new Uint8Array(this.buffer, this.offset, byteLength)
    );
    this.log('bytes', bytes);

    this.offset += byteLength;

    if (this.peekOffset == null) {
      this.flip();
    }
    return bytes;
  }
}

class Writer {
  constructor(
    buffer,
    { initialOffset = 4, useAtomics = true, stream = true, debug, name } = {}
  ) {
    this.buffer = buffer;
    this.atomicView = new Int32Array(buffer);
    this.offset = initialOffset;
    this.useAtomics = useAtomics;
    this.stream = stream;

    this.debug = debug;
    this.name = name;

    if (this.useAtomics) {
      // The buffer starts out as writeable
      Atomics.store(this.atomicView, 0, WRITEABLE);
    } else {
      this.atomicView[0] = WRITEABLE;
    }
  }

  log(...args) {
    if (this.debug) {
      console.log(`[writer: ${this.name}]`, ...args);
    }
  }

  waitRead(name) {
    if (this.useAtomics) {
      this.log(`waiting for ${name}`);
      // Switch to writable
      // Atomics.store(this.atomicView, 0, 1);

      let prev = Atomics.compareExchange(
        this.atomicView,
        0,
        WRITEABLE,
        READABLE
      );

      if (prev !== WRITEABLE) {
        throw new Error(
          'Wrote something into unwritable buffer! This is disastrous'
        );
      }

      Atomics.notify(this.atomicView, 0);

      while (Atomics.load(this.atomicView, 0) === READABLE) {
        // console.log('waiting to be read...');
        Atomics.wait(this.atomicView, 0, READABLE, 500);
      }

      this.log(`resumed for ${name}`);
    } else {
      this.atomicView[0] = READABLE;
    }

    this.offset = 4;
  }

  finalize() {
    this.log('finalizing');
    let dataView = new DataView(this.buffer, this.offset);
    dataView.setUint32(0, FINALIZED);
    this.waitRead('finalize');
  }

  string(str) {
    this.log('string', str);

    let byteLength = str.length * 2;
    this._int32(byteLength);

    let dataView = new DataView(this.buffer, this.offset, byteLength);
    for (let i = 0; i < str.length; i++) {
      dataView.setUint16(i * 2, str.charCodeAt(i));
    }

    this.offset += byteLength;
    this.waitRead('string');
  }

  _int32(num) {
    let byteLength = 4;

    let dataView = new DataView(this.buffer, this.offset);
    dataView.setInt32(0, num);

    this.offset += byteLength;
  }

  int32(num) {
    this.log('int32', num);
    this._int32(num);
    this.waitRead('int32');
  }

  bytes(buffer) {
    this.log('bytes', buffer);

    let byteLength = buffer.byteLength;
    this._int32(byteLength);
    new Uint8Array(this.buffer, this.offset).set(new Uint8Array(buffer));

    this.offset += byteLength;
    this.waitRead('bytes');
  }
}

function positionToKey$1(pos, blockSize) {
  // We are forced to round because of floating point error. `pos`
  // should always be divisible by `blockSize`
  return Math.round(pos / blockSize);
}

function startWorker(reader, writer) {
  // In a normal world, we'd spawn the worker here as a child worker.
  // However Safari doesn't support nested workers, so we have to
  // proxy them through the main thread
  self.postMessage({
    type: '__absurd:spawn-idb-worker',
    argBuffer: writer.buffer,
    resultBuffer: reader.buffer
  });

  self.addEventListener('message', e => {
    switch (e.data.type) {
      // Normally you would use `postMessage` control the profiler in
      // a worker (just like this worker go those events), and the
      // perf library automatically handles those events. We don't do
      // that for the special backend worker though because it's
      // always blocked when it's not processing. Instead we forward
      // these events by going through the atomics layer to unblock it
      // to make sure it starts immediately
      case '__perf-deets:start-profile':
        writer.string('profile-start');
        writer.finalize();
        reader.int32();
        reader.done();
        break;

      case '__perf-deets:stop-profile':
        writer.string('profile-stop');
        writer.finalize();
        reader.int32();
        reader.done();
        break;
    }
  });
}

class FileOps {
  constructor(filename) {
    this.filename = filename;
  }

  // TODO: This should be renamed to `getDatabaseName`
  getStoreName() {
    return this.filename.replace(/\//g, '-');
  }

  invokeWorker(method, args) {
    if (this.reader == null || this.writer == null) {
      throw new Error(
        `Attempted ${method} on ${this.filename} but file not open`
      );
    }

    let reader = this.reader;
    let writer = this.writer;

    switch (method) {
      case 'readBlocks': {
        let { name, positions, blockSize } = args;

        let res = [];
        for (let pos of positions) {
          writer.string('readBlock');
          writer.string(name);
          writer.int32(positionToKey$1(pos, blockSize));
          writer.finalize();

          let data = reader.bytes();
          reader.done();
          res.push({
            pos,
            // If th length is 0, the block didn't exist. We return a
            // blank block in that case
            data: data.byteLength === 0 ? new ArrayBuffer(blockSize) : data
          });
        }

        return res;
      }

      case 'writeBlocks': {
        let { name, writes, blockSize } = args;
        writer.string('writeBlocks');
        writer.string(name);
        for (let write of writes) {
          writer.int32(positionToKey$1(write.pos, blockSize));
          writer.bytes(write.data);
        }
        writer.finalize();

        let res = reader.int32();
        reader.done();
        return res;
      }

      case 'readMeta': {
        writer.string('readMeta');
        writer.string(args.name);
        writer.finalize();

        let size = reader.int32();
        let blockSize = reader.int32();
        reader.done();
        return size === -1 ? null : { size, blockSize };
      }

      case 'writeMeta': {
        let { name, meta } = args;
        writer.string('writeMeta');
        writer.string(name);
        writer.int32(meta.size);
        // writer.int32(meta.blockSize);
        writer.finalize();

        let res = reader.int32();
        reader.done();
        return res;
      }

      case 'closeFile': {
        writer.string('closeFile');
        writer.string(args.name);
        writer.finalize();

        let res = reader.int32();
        reader.done();
        return res;
      }

      case 'lockFile': {
        writer.string('lockFile');
        writer.string(args.name);
        writer.int32(args.lockType);
        writer.finalize();

        let res = reader.int32();
        reader.done();
        return res === 0;
      }

      case 'unlockFile': {
        writer.string('unlockFile');
        writer.string(args.name);
        writer.int32(args.lockType);
        writer.finalize();

        let res = reader.int32();
        reader.done();
        return res === 0;
      }
    }
  }

  lock(lockType) {
    return this.invokeWorker('lockFile', {
      name: this.getStoreName(),
      lockType
    });
  }

  unlock(lockType) {
    return this.invokeWorker('unlockFile', {
      name: this.getStoreName(),
      lockType
    });
  }

  delete() {
    // Close the file if it's open
    if (this.reader || this.writer) {
      this.close();
    }

    // We delete it here because we can't do it in the worker; the
    // worker is stopped when the file closes. If we didn't do that,
    // workers would leak in the case of closing a file but not
    // deleting it. We could potentially restart the worker here if
    // needed, but for now just assume that the deletion is a success
    let req = globalThis.indexedDB.deleteDatabase(this.getStoreName());
    req.onerror = () => {
      console.warn(`Deleting ${this.filename} database failed`);
    };
    req.onsuccess = () => {};
  }

  open() {
    let argBuffer = new SharedArrayBuffer(4096 * 9);
    this.writer = new Writer(argBuffer, {
      name: 'args (backend)',
      debug: false
    });

    let resultBuffer = new SharedArrayBuffer(4096 * 9);
    this.reader = new Reader(resultBuffer, {
      name: 'results',
      debug: false
    });

    // TODO: We could pool workers and reuse them so opening files
    // aren't so slow
    startWorker(this.reader, this.writer);
  }

  close() {
    this.invokeWorker('closeFile', { name: this.getStoreName() });
    this.reader = null;
    this.writer = null;
    this.worker = null;
  }

  readMeta() {
    return this.invokeWorker('readMeta', { name: this.getStoreName() });
  }

  writeMeta(meta) {
    return this.invokeWorker('writeMeta', { name: this.getStoreName(), meta });
  }

  readBlocks(positions, blockSize) {
    if (this.stats) {
      this.stats.read += positions.length;
    }

    return this.invokeWorker('readBlocks', {
      name: this.getStoreName(),
      positions,
      blockSize
    });
  }

  writeBlocks(writes, blockSize) {
    if (this.stats) {
      this.stats.writes += writes.length;
    }

    return this.invokeWorker('writeBlocks', {
      name: this.getStoreName(),
      writes,
      blockSize
    });
  }
}

function positionToKey(pos, blockSize) {
  // We are forced to round because of floating point error. `pos`
  // should always be divisible by `blockSize`
  return Math.round(pos / blockSize);
}

async function openDb(name) {
  return new Promise((resolve, reject) => {
    let req = globalThis.indexedDB.open(name, 2);
    req.onsuccess = event => {
      let db = event.target.result;

      db.onversionchange = () => {
        console.log('closing because version changed');
        db.close();
      };
      db.onclose = () => {};

      resolve(db);
    };
    req.onupgradeneeded = event => {
      let db = event.target.result;
      if (!db.objectStoreNames.contains('data')) {
        db.createObjectStore('data');
      }
    };
    req.onblocked = e => console.log('blocked', e);
    req.onerror = req.onabort = e => reject(e.target.error);
  });
}

// Using a separate class makes it easier to follow the code, and
// importantly it removes any reliance on internal state in
// `FileOpsFallback`. That would be problematic since these method
// happen async; the args to `write` must be closed over so they don't
// change
class Persistance {
  constructor(onFallbackFailure) {
    this._openDb = null;
    this.hasAlertedFailure = false;
    this.onFallbackFailure = onFallbackFailure;
  }

  async getDb() {
    if (this._openDb) {
      return this._openDb;
    }

    this._openDb = await openDb(this.dbName);
    return this._openDb;
  }

  closeDb() {
    if (this._openDb) {
      this._openDb.close();
      this._openDb = null;
    }
  }

  // Both `readAll` and `write` rely on IndexedDB transactional
  // semantics to work, otherwise we'd have to coordinate them. If
  // there are pending writes, the `readonly` transaction in `readAll`
  // will block until they are all flushed out. If `write` is called
  // multiple times, `readwrite` transactions can only run one at a
  // time so it will naturally apply the writes sequentially (and
  // atomically)

  async readAll() {
    let db = await this.getDb(this.dbName);
    let blocks = new Map();

    let trans = db.transaction(['data'], 'readonly');
    let store = trans.objectStore('data');

    return new Promise((resolve, reject) => {
      // Open a cursor and iterate through the entire file
      let req = store.openCursor(IDBKeyRange.lowerBound(-1));
      req.onerror = reject;
      req.onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
          blocks.set(cursor.key, cursor.value);
          cursor.continue();
        } else {
          resolve(blocks);
        }
      };
    });
  }

  async write(writes, cachedFirstBlock, hasLocked) {
    let db = await this.getDb(this.dbName);

    // We need grab a readwrite lock on the db, and then read to check
    // to make sure we can write to it
    let trans = db.transaction(['data'], 'readwrite');
    let store = trans.objectStore('data');

    await new Promise((resolve, reject) => {
      let req = store.get(0);
      req.onsuccess = e => {
        if (hasLocked) {
          if (!isSafeToWrite(req.result, cachedFirstBlock)) {
            if (this.onFallbackFailure && !this.hasAlertedFailure) {
              this.hasAlertedFailure = true;
              this.onFallbackFailure();
            }
            reject(new Error('Fallback mode unable to write file changes'));
            return;
          }
        }

        // Flush all the writes
        for (let write of writes) {
          store.put(write.value, write.key);
        }

        trans.onsuccess = () => resolve();
        trans.onerror = () => reject();
      };
      req.onerror = reject;
    });
  }
}

class FileOpsFallback {
  constructor(filename, onFallbackFailure) {
    this.filename = filename;
    this.dbName = this.filename.replace(/\//g, '-');
    this.cachedFirstBlock = null;
    this.writeQueue = null;
    this.blocks = new Map();
    this.lockType = 0;
    this.transferBlockOwnership = false;

    this.persistance = new Persistance(onFallbackFailure);
  }

  async readIfFallback() {
    this.transferBlockOwnership = true;
    this.blocks = await this.persistance.readAll();

    return this.readMeta();
  }

  lock(lockType) {
    // Locks always succeed here. Essentially we're only working
    // locally (we can't see any writes from anybody else) and we just
    // want to track the lock so we know when it downgrades from write
    // to read
    this.cachedFirstBlock = this.blocks.get(0);
    this.lockType = lockType;
    return true;
  }

  unlock(lockType) {
    if (this.lockType > LOCK_TYPES.SHARED && lockType === LOCK_TYPES.SHARED) {
      // Within a write lock, we delay all writes until the end of the
      // lock. We probably don't have to do this since we already
      // delay writes until an `fsync`, however this is an extra
      // measure to make sure we are writing everything atomically
      this.flush();
    }
    this.lockType = lockType;
    return true;
  }

  delete() {
    let req = globalThis.indexedDB.deleteDatabase(this.dbName);
    req.onerror = () => {
      console.warn(`Deleting ${this.filename} database failed`);
    };
    req.onsuccess = () => {};
  }

  open() {
    this.writeQueue = [];
    this.lockType = 0;
  }

  close() {
    this.flush();

    if (this.transferBlockOwnership) {
      this.transferBlockOwnership = false;
    } else {
      this.blocks = new Map();
    }

    this.persistance.closeDb();
  }

  readMeta() {
    let metaBlock = this.blocks.get(-1);
    if (metaBlock) {
      let block = this.blocks.get(0);

      return {
        size: metaBlock.size,
        blockSize: getPageSize(new Uint8Array(block))
      };
    }
    return null;
  }

  writeMeta(meta) {
    this.blocks.set(-1, meta);
    this.queueWrite(-1, meta);
  }

  readBlocks(positions, blockSize) {
    let res = [];
    for (let pos of positions) {
      res.push({
        pos,
        data: this.blocks.get(positionToKey(pos, blockSize))
      });
    }
    return res;
  }

  writeBlocks(writes, blockSize) {
    for (let write of writes) {
      let key = positionToKey(write.pos, blockSize);
      this.blocks.set(key, write.data);
      this.queueWrite(key, write.data);
    }

    // No write lock; flush them out immediately
    if (this.lockType <= LOCK_TYPES.SHARED) {
      this.flush();
    }
  }

  queueWrite(key, value) {
    this.writeQueue.push({ key, value });
  }

  flush() {
    if (this.writeQueue.length > 0) {
      this.persistance.write(
        this.writeQueue,
        this.cachedFirstBlock,
        this.lockType > LOCK_TYPES.SHARED
      );
      this.writeQueue = [];
    }
    this.cachedFirstBlock = null;
  }
}

class IndexedDBBackend {
  constructor(onFallbackFailure) {
    this.onFallbackFailure = onFallbackFailure;
  }

  createFile(filename) {
    let ops;
    if (typeof SharedArrayBuffer !== 'undefined') {
      // SharedArrayBuffer exists! We can run this fully
      ops = new FileOps(filename);
    } else {
      // SharedArrayBuffer is not supported. Use the fallback methods
      // which provide a somewhat working version, but doesn't
      // support mutations across connections (tabs)
      ops = new FileOpsFallback(filename, this.onFallbackFailure);
    }

    let file = new File(filename, ops);

    // If we don't need perf data, there's no reason for us to hold a
    // reference to the files. If we did we'd have to worry about
    // memory leaks
    if (false) {}

    return file;
  }

  // Instead of controlling the profiler from the main thread by
  // posting a message to this worker, you can control it inside the
  // worker manually with these methods
  startProfile() {
    for (let file of this._files) {
      // If the writer doesn't exist, that means the file has been
      // deleted
      if (file.ops.writer) {
        let writer = file.ops.writer;
        let reader = file.ops.reader;
        writer.string('profile-start');
        writer.finalize();
        reader.int32();
        reader.done();
      }
    }
  }

  stopProfile() {
    for (let file of this._files) {
      if (file.ops.writer) {
        let writer = file.ops.writer;
        let reader = file.ops.reader;
        writer.string('profile-stop');
        writer.finalize();
        reader.int32();
        reader.done();
      }
    }
  }
}

/* harmony default export */ const indexeddb_backend = (IndexedDBBackend);

;// CONCATENATED MODULE: ./node_modules/absurd-sql/dist/indexeddb-main-thread.js
// The reason for this strange abstraction is because we can't rely on
// nested worker support (Safari doesn't support it). We need to proxy
// creating a child worker through the main thread, and this requires
// a bit of glue code. We don't want to duplicate this code in each
// backend that needs it, so this module abstracts it out. It has to
// have a strange shape because we don't want to eagerly bundle the
// backend code, so users of this code need to pass an `() =>
// import('worker.js')` expression to get the worker module to run.

function isWorker() {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope
  );
}

function makeStartWorkerFromMain(getModule) {
  return (argBuffer, resultBuffer, parentWorker) => {
    if (isWorker()) {
      throw new Error(
        '`startWorkerFromMain` should only be called from the main thread'
      );
    }

    if (typeof Worker === 'undefined') {
      // We're on the main thread? Weird: it doesn't have workers
      throw new Error(
        'Web workers not available. sqlite3 requires web workers to work.'
      );
    }

    getModule().then(({ default: BackendWorker }) => {
      let worker = new BackendWorker();

      worker.postMessage({ type: 'init', buffers: [argBuffer, resultBuffer] });

      worker.addEventListener('message', msg => {
        // Forward any messages to the worker that's supposed
        // to be the parent
        parentWorker.postMessage(msg.data);
      });
    });
  };
}

function makeInitBackend(spawnEventName, getModule) {
  const startWorkerFromMain = makeStartWorkerFromMain(getModule);

  return worker => {
    worker.addEventListener('message', e => {
      switch (e.data.type) {
        case spawnEventName:
          startWorkerFromMain(e.data.argBuffer, e.data.resultBuffer, worker);
          break;
      }
    });
  };
}

// Use the generic main thread module to create our indexeddb worker
// proxy
const initBackend = makeInitBackend('__absurd:spawn-idb-worker', () =>
  __webpack_require__.e(/* import() */ 661).then(__webpack_require__.bind(__webpack_require__, 661))
);



;// CONCATENATED MODULE: ./src/service-worker.js





const exec = () => {
  console.log('init start')
  const initPromise = sql_wasm_default()({ locateFile: (file) => file })
    .then((SQL) => {
      console.log("initSqlJs");
      const sqlFS = new SQLiteFS(SQL.FS, new indexeddb_backend());
      SQL.register_for_idb(sqlFS);
      console.log("register for idb");

      SQL.FS.mkdir("/sql");
      console.log("mkdir");
      SQL.FS.mount(sqlFS, {}, "/sql");
      console.log("mount");

      let db = new SQL.Database("/sql/db.sqlite", { filename: true });
      console.log("new db");
      // You might want to try `PRAGMA page_size=8192;` too!
      db.exec(`
          PRAGMA journal_mode=MEMORY;
        `);

      console.log("sql init complete");
    })
    .catch((err) => {
      console.error("sql init error", err);
    });
  console.log("self", self)
  initBackend(self);

  return initPromise;
};

chrome.runtime.onInstalled.addListener(() => {
  exec();
});

globalThis.exec = exec

})();

/******/ })()
;