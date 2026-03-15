/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */function Sn(n){return typeof n>"u"||n===null}function dr(n){return typeof n=="object"&&n!==null}function mr(n){return Array.isArray(n)?n:Sn(n)?[]:[n]}function gr(n,r){var e,l,i,u;if(r)for(u=Object.keys(r),e=0,l=u.length;e<l;e+=1)i=u[e],n[i]=r[i];return n}function xr(n,r){var e="",l;for(l=0;l<r;l+=1)e+=n;return e}function Ar(n){return n===0&&Number.NEGATIVE_INFINITY===1/n}var vr=Sn,yr=dr,br=mr,Cr=xr,wr=Ar,_r=gr,b={isNothing:vr,isObject:yr,toArray:br,repeat:Cr,isNegativeZero:wr,extend:_r};function En(n,r){var e="",l=n.reason||"(unknown reason)";return n.mark?(n.mark.name&&(e+='in "'+n.mark.name+'" '),e+="("+(n.mark.line+1)+":"+(n.mark.column+1)+")",!r&&n.mark.snippet&&(e+=`

`+n.mark.snippet),l+" "+e):l}function H(n,r){Error.call(this),this.name="YAMLException",this.reason=n,this.mark=r,this.message=En(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}H.prototype=Object.create(Error.prototype);H.prototype.constructor=H;H.prototype.toString=function(r){return this.name+": "+En(this,r)};var _=H;function z(n,r,e,l,i){var u="",o="",c=Math.floor(i/2)-1;return l-r>c&&(u=" ... ",r=l-c+u.length),e-l>c&&(o=" ...",e=l+c-o.length),{str:u+n.slice(r,e).replace(/\t/g,"→")+o,pos:l-r+u.length}}function Z(n,r){return b.repeat(" ",r-n.length)+n}function Sr(n,r){if(r=Object.create(r||null),!n.buffer)return null;r.maxLength||(r.maxLength=79),typeof r.indent!="number"&&(r.indent=1),typeof r.linesBefore!="number"&&(r.linesBefore=3),typeof r.linesAfter!="number"&&(r.linesAfter=2);for(var e=/\r?\n|\r|\0/g,l=[0],i=[],u,o=-1;u=e.exec(n.buffer);)i.push(u.index),l.push(u.index+u[0].length),n.position<=u.index&&o<0&&(o=l.length-2);o<0&&(o=l.length-1);var c="",a,t,p=Math.min(n.line+r.linesAfter,i.length).toString().length,f=r.maxLength-(r.indent+p+3);for(a=1;a<=r.linesBefore&&!(o-a<0);a++)t=z(n.buffer,l[o-a],i[o-a],n.position-(l[o]-l[o-a]),f),c=b.repeat(" ",r.indent)+Z((n.line-a+1).toString(),p)+" | "+t.str+`
`+c;for(t=z(n.buffer,l[o],i[o],n.position,f),c+=b.repeat(" ",r.indent)+Z((n.line+1).toString(),p)+" | "+t.str+`
`,c+=b.repeat("-",r.indent+p+3+t.pos)+`^
`,a=1;a<=r.linesAfter&&!(o+a>=i.length);a++)t=z(n.buffer,l[o+a],i[o+a],n.position-(l[o]-l[o+a]),f),c+=b.repeat(" ",r.indent)+Z((n.line+a+1).toString(),p)+" | "+t.str+`
`;return c.replace(/\n$/,"")}var Er=Sr,Tr=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Fr=["scalar","sequence","mapping"];function kr(n){var r={};return n!==null&&Object.keys(n).forEach(function(e){n[e].forEach(function(l){r[String(l)]=e})}),r}function Or(n,r){if(r=r||{},Object.keys(r).forEach(function(e){if(Tr.indexOf(e)===-1)throw new _('Unknown option "'+e+'" is met in definition of "'+n+'" YAML type.')}),this.options=r,this.tag=n,this.kind=r.kind||null,this.resolve=r.resolve||function(){return!0},this.construct=r.construct||function(e){return e},this.instanceOf=r.instanceOf||null,this.predicate=r.predicate||null,this.represent=r.represent||null,this.representName=r.representName||null,this.defaultStyle=r.defaultStyle||null,this.multi=r.multi||!1,this.styleAliases=kr(r.styleAliases||null),Fr.indexOf(this.kind)===-1)throw new _('Unknown kind "'+this.kind+'" is specified for "'+n+'" YAML type.')}var C=Or;function fn(n,r){var e=[];return n[r].forEach(function(l){var i=e.length;e.forEach(function(u,o){u.tag===l.tag&&u.kind===l.kind&&u.multi===l.multi&&(i=o)}),e[i]=l}),e}function Ir(){var n={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},r,e;function l(i){i.multi?(n.multi[i.kind].push(i),n.multi.fallback.push(i)):n[i.kind][i.tag]=n.fallback[i.tag]=i}for(r=0,e=arguments.length;r<e;r+=1)arguments[r].forEach(l);return n}function X(n){return this.extend(n)}X.prototype.extend=function(r){var e=[],l=[];if(r instanceof C)l.push(r);else if(Array.isArray(r))l=l.concat(r);else if(r&&(Array.isArray(r.implicit)||Array.isArray(r.explicit)))r.implicit&&(e=e.concat(r.implicit)),r.explicit&&(l=l.concat(r.explicit));else throw new _("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(u){if(!(u instanceof C))throw new _("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(u.loadKind&&u.loadKind!=="scalar")throw new _("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(u.multi)throw new _("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),l.forEach(function(u){if(!(u instanceof C))throw new _("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(X.prototype);return i.implicit=(this.implicit||[]).concat(e),i.explicit=(this.explicit||[]).concat(l),i.compiledImplicit=fn(i,"implicit"),i.compiledExplicit=fn(i,"explicit"),i.compiledTypeMap=Ir(i.compiledImplicit,i.compiledExplicit),i};var Tn=X,Fn=new C("tag:yaml.org,2002:str",{kind:"scalar",construct:function(n){return n!==null?n:""}}),kn=new C("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(n){return n!==null?n:[]}}),On=new C("tag:yaml.org,2002:map",{kind:"mapping",construct:function(n){return n!==null?n:{}}}),In=new Tn({explicit:[Fn,kn,On]});function Lr(n){if(n===null)return!0;var r=n.length;return r===1&&n==="~"||r===4&&(n==="null"||n==="Null"||n==="NULL")}function Nr(){return null}function Mr(n){return n===null}var Ln=new C("tag:yaml.org,2002:null",{kind:"scalar",resolve:Lr,construct:Nr,predicate:Mr,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function Dr(n){if(n===null)return!1;var r=n.length;return r===4&&(n==="true"||n==="True"||n==="TRUE")||r===5&&(n==="false"||n==="False"||n==="FALSE")}function Rr(n){return n==="true"||n==="True"||n==="TRUE"}function Br(n){return Object.prototype.toString.call(n)==="[object Boolean]"}var Nn=new C("tag:yaml.org,2002:bool",{kind:"scalar",resolve:Dr,construct:Rr,predicate:Br,represent:{lowercase:function(n){return n?"true":"false"},uppercase:function(n){return n?"TRUE":"FALSE"},camelcase:function(n){return n?"True":"False"}},defaultStyle:"lowercase"});function Yr(n){return 48<=n&&n<=57||65<=n&&n<=70||97<=n&&n<=102}function Hr(n){return 48<=n&&n<=55}function jr(n){return 48<=n&&n<=57}function Pr(n){if(n===null)return!1;var r=n.length,e=0,l=!1,i;if(!r)return!1;if(i=n[e],(i==="-"||i==="+")&&(i=n[++e]),i==="0"){if(e+1===r)return!0;if(i=n[++e],i==="b"){for(e++;e<r;e++)if(i=n[e],i!=="_"){if(i!=="0"&&i!=="1")return!1;l=!0}return l&&i!=="_"}if(i==="x"){for(e++;e<r;e++)if(i=n[e],i!=="_"){if(!Yr(n.charCodeAt(e)))return!1;l=!0}return l&&i!=="_"}if(i==="o"){for(e++;e<r;e++)if(i=n[e],i!=="_"){if(!Hr(n.charCodeAt(e)))return!1;l=!0}return l&&i!=="_"}}if(i==="_")return!1;for(;e<r;e++)if(i=n[e],i!=="_"){if(!jr(n.charCodeAt(e)))return!1;l=!0}return!(!l||i==="_")}function Ur(n){var r=n,e=1,l;if(r.indexOf("_")!==-1&&(r=r.replace(/_/g,"")),l=r[0],(l==="-"||l==="+")&&(l==="-"&&(e=-1),r=r.slice(1),l=r[0]),r==="0")return 0;if(l==="0"){if(r[1]==="b")return e*parseInt(r.slice(2),2);if(r[1]==="x")return e*parseInt(r.slice(2),16);if(r[1]==="o")return e*parseInt(r.slice(2),8)}return e*parseInt(r,10)}function Kr(n){return Object.prototype.toString.call(n)==="[object Number]"&&n%1===0&&!b.isNegativeZero(n)}var Mn=new C("tag:yaml.org,2002:int",{kind:"scalar",resolve:Pr,construct:Ur,predicate:Kr,represent:{binary:function(n){return n>=0?"0b"+n.toString(2):"-0b"+n.toString(2).slice(1)},octal:function(n){return n>=0?"0o"+n.toString(8):"-0o"+n.toString(8).slice(1)},decimal:function(n){return n.toString(10)},hexadecimal:function(n){return n>=0?"0x"+n.toString(16).toUpperCase():"-0x"+n.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Gr=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Wr(n){return!(n===null||!Gr.test(n)||n[n.length-1]==="_")}function qr(n){var r,e;return r=n.replace(/_/g,"").toLowerCase(),e=r[0]==="-"?-1:1,"+-".indexOf(r[0])>=0&&(r=r.slice(1)),r===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:r===".nan"?NaN:e*parseFloat(r,10)}var $r=/^[-+]?[0-9]+e/;function Qr(n,r){var e;if(isNaN(n))switch(r){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===n)switch(r){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===n)switch(r){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(b.isNegativeZero(n))return"-0.0";return e=n.toString(10),$r.test(e)?e.replace("e",".e"):e}function zr(n){return Object.prototype.toString.call(n)==="[object Number]"&&(n%1!==0||b.isNegativeZero(n))}var Dn=new C("tag:yaml.org,2002:float",{kind:"scalar",resolve:Wr,construct:qr,predicate:zr,represent:Qr,defaultStyle:"lowercase"}),Rn=In.extend({implicit:[Ln,Nn,Mn,Dn]}),Bn=Rn,Yn=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Hn=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Zr(n){return n===null?!1:Yn.exec(n)!==null||Hn.exec(n)!==null}function Vr(n){var r,e,l,i,u,o,c,a=0,t=null,p,f,h;if(r=Yn.exec(n),r===null&&(r=Hn.exec(n)),r===null)throw new Error("Date resolve error");if(e=+r[1],l=+r[2]-1,i=+r[3],!r[4])return new Date(Date.UTC(e,l,i));if(u=+r[4],o=+r[5],c=+r[6],r[7]){for(a=r[7].slice(0,3);a.length<3;)a+="0";a=+a}return r[9]&&(p=+r[10],f=+(r[11]||0),t=(p*60+f)*6e4,r[9]==="-"&&(t=-t)),h=new Date(Date.UTC(e,l,i,u,o,c,a)),t&&h.setTime(h.getTime()-t),h}function Xr(n){return n.toISOString()}var jn=new C("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:Zr,construct:Vr,instanceOf:Date,represent:Xr});function Jr(n){return n==="<<"||n===null}var Pn=new C("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Jr}),ln=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function ne(n){if(n===null)return!1;var r,e,l=0,i=n.length,u=ln;for(e=0;e<i;e++)if(r=u.indexOf(n.charAt(e)),!(r>64)){if(r<0)return!1;l+=6}return l%8===0}function re(n){var r,e,l=n.replace(/[\r\n=]/g,""),i=l.length,u=ln,o=0,c=[];for(r=0;r<i;r++)r%4===0&&r&&(c.push(o>>16&255),c.push(o>>8&255),c.push(o&255)),o=o<<6|u.indexOf(l.charAt(r));return e=i%4*6,e===0?(c.push(o>>16&255),c.push(o>>8&255),c.push(o&255)):e===18?(c.push(o>>10&255),c.push(o>>2&255)):e===12&&c.push(o>>4&255),new Uint8Array(c)}function ee(n){var r="",e=0,l,i,u=n.length,o=ln;for(l=0;l<u;l++)l%3===0&&l&&(r+=o[e>>18&63],r+=o[e>>12&63],r+=o[e>>6&63],r+=o[e&63]),e=(e<<8)+n[l];return i=u%3,i===0?(r+=o[e>>18&63],r+=o[e>>12&63],r+=o[e>>6&63],r+=o[e&63]):i===2?(r+=o[e>>10&63],r+=o[e>>4&63],r+=o[e<<2&63],r+=o[64]):i===1&&(r+=o[e>>2&63],r+=o[e<<4&63],r+=o[64],r+=o[64]),r}function ie(n){return Object.prototype.toString.call(n)==="[object Uint8Array]"}var Un=new C("tag:yaml.org,2002:binary",{kind:"scalar",resolve:ne,construct:re,predicate:ie,represent:ee}),le=Object.prototype.hasOwnProperty,oe=Object.prototype.toString;function ue(n){if(n===null)return!0;var r=[],e,l,i,u,o,c=n;for(e=0,l=c.length;e<l;e+=1){if(i=c[e],o=!1,oe.call(i)!=="[object Object]")return!1;for(u in i)if(le.call(i,u))if(!o)o=!0;else return!1;if(!o)return!1;if(r.indexOf(u)===-1)r.push(u);else return!1}return!0}function ce(n){return n!==null?n:[]}var Kn=new C("tag:yaml.org,2002:omap",{kind:"sequence",resolve:ue,construct:ce}),ae=Object.prototype.toString;function te(n){if(n===null)return!0;var r,e,l,i,u,o=n;for(u=new Array(o.length),r=0,e=o.length;r<e;r+=1){if(l=o[r],ae.call(l)!=="[object Object]"||(i=Object.keys(l),i.length!==1))return!1;u[r]=[i[0],l[i[0]]]}return!0}function fe(n){if(n===null)return[];var r,e,l,i,u,o=n;for(u=new Array(o.length),r=0,e=o.length;r<e;r+=1)l=o[r],i=Object.keys(l),u[r]=[i[0],l[i[0]]];return u}var Gn=new C("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:te,construct:fe}),pe=Object.prototype.hasOwnProperty;function se(n){if(n===null)return!0;var r,e=n;for(r in e)if(pe.call(e,r)&&e[r]!==null)return!1;return!0}function he(n){return n!==null?n:{}}var Wn=new C("tag:yaml.org,2002:set",{kind:"mapping",resolve:se,construct:he}),on=Bn.extend({implicit:[jn,Pn],explicit:[Un,Kn,Gn,Wn]}),I=Object.prototype.hasOwnProperty,K=1,qn=2,$n=3,G=4,V=1,de=2,pn=3,me=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,ge=/[\x85\u2028\u2029]/,xe=/[,\[\]\{\}]/,Qn=/^(?:!|!!|![a-z\-]+!)$/i,zn=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function sn(n){return Object.prototype.toString.call(n)}function F(n){return n===10||n===13}function L(n){return n===9||n===32}function S(n){return n===9||n===32||n===10||n===13}function D(n){return n===44||n===91||n===93||n===123||n===125}function Ae(n){var r;return 48<=n&&n<=57?n-48:(r=n|32,97<=r&&r<=102?r-97+10:-1)}function ve(n){return n===120?2:n===117?4:n===85?8:0}function ye(n){return 48<=n&&n<=57?n-48:-1}function hn(n){return n===48?"\0":n===97?"\x07":n===98?"\b":n===116||n===9?"	":n===110?`
`:n===118?"\v":n===102?"\f":n===114?"\r":n===101?"\x1B":n===32?" ":n===34?'"':n===47?"/":n===92?"\\":n===78?"":n===95?" ":n===76?"\u2028":n===80?"\u2029":""}function be(n){return n<=65535?String.fromCharCode(n):String.fromCharCode((n-65536>>10)+55296,(n-65536&1023)+56320)}function Zn(n,r,e){r==="__proto__"?Object.defineProperty(n,r,{configurable:!0,enumerable:!0,writable:!0,value:e}):n[r]=e}var Vn=new Array(256),Xn=new Array(256);for(var N=0;N<256;N++)Vn[N]=hn(N)?1:0,Xn[N]=hn(N);function Ce(n,r){this.input=n,this.filename=r.filename||null,this.schema=r.schema||on,this.onWarning=r.onWarning||null,this.legacy=r.legacy||!1,this.json=r.json||!1,this.listener=r.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=n.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Jn(n,r){var e={name:n.filename,buffer:n.input.slice(0,-1),position:n.position,line:n.line,column:n.position-n.lineStart};return e.snippet=Er(e),new _(r,e)}function s(n,r){throw Jn(n,r)}function W(n,r){n.onWarning&&n.onWarning.call(null,Jn(n,r))}var dn={YAML:function(r,e,l){var i,u,o;r.version!==null&&s(r,"duplication of %YAML directive"),l.length!==1&&s(r,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(l[0]),i===null&&s(r,"ill-formed argument of the YAML directive"),u=parseInt(i[1],10),o=parseInt(i[2],10),u!==1&&s(r,"unacceptable YAML version of the document"),r.version=l[0],r.checkLineBreaks=o<2,o!==1&&o!==2&&W(r,"unsupported YAML version of the document")},TAG:function(r,e,l){var i,u;l.length!==2&&s(r,"TAG directive accepts exactly two arguments"),i=l[0],u=l[1],Qn.test(i)||s(r,"ill-formed tag handle (first argument) of the TAG directive"),I.call(r.tagMap,i)&&s(r,'there is a previously declared suffix for "'+i+'" tag handle'),zn.test(u)||s(r,"ill-formed tag prefix (second argument) of the TAG directive");try{u=decodeURIComponent(u)}catch{s(r,"tag prefix is malformed: "+u)}r.tagMap[i]=u}};function O(n,r,e,l){var i,u,o,c;if(r<e){if(c=n.input.slice(r,e),l)for(i=0,u=c.length;i<u;i+=1)o=c.charCodeAt(i),o===9||32<=o&&o<=1114111||s(n,"expected valid JSON character");else me.test(c)&&s(n,"the stream contains non-printable characters");n.result+=c}}function mn(n,r,e,l){var i,u,o,c;for(b.isObject(e)||s(n,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(e),o=0,c=i.length;o<c;o+=1)u=i[o],I.call(r,u)||(Zn(r,u,e[u]),l[u]=!0)}function R(n,r,e,l,i,u,o,c,a){var t,p;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),t=0,p=i.length;t<p;t+=1)Array.isArray(i[t])&&s(n,"nested arrays are not supported inside keys"),typeof i=="object"&&sn(i[t])==="[object Object]"&&(i[t]="[object Object]");if(typeof i=="object"&&sn(i)==="[object Object]"&&(i="[object Object]"),i=String(i),r===null&&(r={}),l==="tag:yaml.org,2002:merge")if(Array.isArray(u))for(t=0,p=u.length;t<p;t+=1)mn(n,r,u[t],e);else mn(n,r,u,e);else!n.json&&!I.call(e,i)&&I.call(r,i)&&(n.line=o||n.line,n.lineStart=c||n.lineStart,n.position=a||n.position,s(n,"duplicated mapping key")),Zn(r,i,u),delete e[i];return r}function un(n){var r;r=n.input.charCodeAt(n.position),r===10?n.position++:r===13?(n.position++,n.input.charCodeAt(n.position)===10&&n.position++):s(n,"a line break is expected"),n.line+=1,n.lineStart=n.position,n.firstTabInLine=-1}function y(n,r,e){for(var l=0,i=n.input.charCodeAt(n.position);i!==0;){for(;L(i);)i===9&&n.firstTabInLine===-1&&(n.firstTabInLine=n.position),i=n.input.charCodeAt(++n.position);if(r&&i===35)do i=n.input.charCodeAt(++n.position);while(i!==10&&i!==13&&i!==0);if(F(i))for(un(n),i=n.input.charCodeAt(n.position),l++,n.lineIndent=0;i===32;)n.lineIndent++,i=n.input.charCodeAt(++n.position);else break}return e!==-1&&l!==0&&n.lineIndent<e&&W(n,"deficient indentation"),l}function Q(n){var r=n.position,e;return e=n.input.charCodeAt(r),!!((e===45||e===46)&&e===n.input.charCodeAt(r+1)&&e===n.input.charCodeAt(r+2)&&(r+=3,e=n.input.charCodeAt(r),e===0||S(e)))}function cn(n,r){r===1?n.result+=" ":r>1&&(n.result+=b.repeat(`
`,r-1))}function we(n,r,e){var l,i,u,o,c,a,t,p,f=n.kind,h=n.result,d;if(d=n.input.charCodeAt(n.position),S(d)||D(d)||d===35||d===38||d===42||d===33||d===124||d===62||d===39||d===34||d===37||d===64||d===96||(d===63||d===45)&&(i=n.input.charCodeAt(n.position+1),S(i)||e&&D(i)))return!1;for(n.kind="scalar",n.result="",u=o=n.position,c=!1;d!==0;){if(d===58){if(i=n.input.charCodeAt(n.position+1),S(i)||e&&D(i))break}else if(d===35){if(l=n.input.charCodeAt(n.position-1),S(l))break}else{if(n.position===n.lineStart&&Q(n)||e&&D(d))break;if(F(d))if(a=n.line,t=n.lineStart,p=n.lineIndent,y(n,!1,-1),n.lineIndent>=r){c=!0,d=n.input.charCodeAt(n.position);continue}else{n.position=o,n.line=a,n.lineStart=t,n.lineIndent=p;break}}c&&(O(n,u,o,!1),cn(n,n.line-a),u=o=n.position,c=!1),L(d)||(o=n.position+1),d=n.input.charCodeAt(++n.position)}return O(n,u,o,!1),n.result?!0:(n.kind=f,n.result=h,!1)}function _e(n,r){var e,l,i;if(e=n.input.charCodeAt(n.position),e!==39)return!1;for(n.kind="scalar",n.result="",n.position++,l=i=n.position;(e=n.input.charCodeAt(n.position))!==0;)if(e===39)if(O(n,l,n.position,!0),e=n.input.charCodeAt(++n.position),e===39)l=n.position,n.position++,i=n.position;else return!0;else F(e)?(O(n,l,i,!0),cn(n,y(n,!1,r)),l=i=n.position):n.position===n.lineStart&&Q(n)?s(n,"unexpected end of the document within a single quoted scalar"):(n.position++,i=n.position);s(n,"unexpected end of the stream within a single quoted scalar")}function Se(n,r){var e,l,i,u,o,c;if(c=n.input.charCodeAt(n.position),c!==34)return!1;for(n.kind="scalar",n.result="",n.position++,e=l=n.position;(c=n.input.charCodeAt(n.position))!==0;){if(c===34)return O(n,e,n.position,!0),n.position++,!0;if(c===92){if(O(n,e,n.position,!0),c=n.input.charCodeAt(++n.position),F(c))y(n,!1,r);else if(c<256&&Vn[c])n.result+=Xn[c],n.position++;else if((o=ve(c))>0){for(i=o,u=0;i>0;i--)c=n.input.charCodeAt(++n.position),(o=Ae(c))>=0?u=(u<<4)+o:s(n,"expected hexadecimal character");n.result+=be(u),n.position++}else s(n,"unknown escape sequence");e=l=n.position}else F(c)?(O(n,e,l,!0),cn(n,y(n,!1,r)),e=l=n.position):n.position===n.lineStart&&Q(n)?s(n,"unexpected end of the document within a double quoted scalar"):(n.position++,l=n.position)}s(n,"unexpected end of the stream within a double quoted scalar")}function Ee(n,r){var e=!0,l,i,u,o=n.tag,c,a=n.anchor,t,p,f,h,d,m=Object.create(null),x,A,E,g;if(g=n.input.charCodeAt(n.position),g===91)p=93,d=!1,c=[];else if(g===123)p=125,d=!0,c={};else return!1;for(n.anchor!==null&&(n.anchorMap[n.anchor]=c),g=n.input.charCodeAt(++n.position);g!==0;){if(y(n,!0,r),g=n.input.charCodeAt(n.position),g===p)return n.position++,n.tag=o,n.anchor=a,n.kind=d?"mapping":"sequence",n.result=c,!0;e?g===44&&s(n,"expected the node content, but found ','"):s(n,"missed comma between flow collection entries"),A=x=E=null,f=h=!1,g===63&&(t=n.input.charCodeAt(n.position+1),S(t)&&(f=h=!0,n.position++,y(n,!0,r))),l=n.line,i=n.lineStart,u=n.position,B(n,r,K,!1,!0),A=n.tag,x=n.result,y(n,!0,r),g=n.input.charCodeAt(n.position),(h||n.line===l)&&g===58&&(f=!0,g=n.input.charCodeAt(++n.position),y(n,!0,r),B(n,r,K,!1,!0),E=n.result),d?R(n,c,m,A,x,E,l,i,u):f?c.push(R(n,null,m,A,x,E,l,i,u)):c.push(x),y(n,!0,r),g=n.input.charCodeAt(n.position),g===44?(e=!0,g=n.input.charCodeAt(++n.position)):e=!1}s(n,"unexpected end of the stream within a flow collection")}function Te(n,r){var e,l,i=V,u=!1,o=!1,c=r,a=0,t=!1,p,f;if(f=n.input.charCodeAt(n.position),f===124)l=!1;else if(f===62)l=!0;else return!1;for(n.kind="scalar",n.result="";f!==0;)if(f=n.input.charCodeAt(++n.position),f===43||f===45)V===i?i=f===43?pn:de:s(n,"repeat of a chomping mode identifier");else if((p=ye(f))>=0)p===0?s(n,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?s(n,"repeat of an indentation width identifier"):(c=r+p-1,o=!0);else break;if(L(f)){do f=n.input.charCodeAt(++n.position);while(L(f));if(f===35)do f=n.input.charCodeAt(++n.position);while(!F(f)&&f!==0)}for(;f!==0;){for(un(n),n.lineIndent=0,f=n.input.charCodeAt(n.position);(!o||n.lineIndent<c)&&f===32;)n.lineIndent++,f=n.input.charCodeAt(++n.position);if(!o&&n.lineIndent>c&&(c=n.lineIndent),F(f)){a++;continue}if(n.lineIndent<c){i===pn?n.result+=b.repeat(`
`,u?1+a:a):i===V&&u&&(n.result+=`
`);break}for(l?L(f)?(t=!0,n.result+=b.repeat(`
`,u?1+a:a)):t?(t=!1,n.result+=b.repeat(`
`,a+1)):a===0?u&&(n.result+=" "):n.result+=b.repeat(`
`,a):n.result+=b.repeat(`
`,u?1+a:a),u=!0,o=!0,a=0,e=n.position;!F(f)&&f!==0;)f=n.input.charCodeAt(++n.position);O(n,e,n.position,!1)}return!0}function gn(n,r){var e,l=n.tag,i=n.anchor,u=[],o,c=!1,a;if(n.firstTabInLine!==-1)return!1;for(n.anchor!==null&&(n.anchorMap[n.anchor]=u),a=n.input.charCodeAt(n.position);a!==0&&(n.firstTabInLine!==-1&&(n.position=n.firstTabInLine,s(n,"tab characters must not be used in indentation")),!(a!==45||(o=n.input.charCodeAt(n.position+1),!S(o))));){if(c=!0,n.position++,y(n,!0,-1)&&n.lineIndent<=r){u.push(null),a=n.input.charCodeAt(n.position);continue}if(e=n.line,B(n,r,$n,!1,!0),u.push(n.result),y(n,!0,-1),a=n.input.charCodeAt(n.position),(n.line===e||n.lineIndent>r)&&a!==0)s(n,"bad indentation of a sequence entry");else if(n.lineIndent<r)break}return c?(n.tag=l,n.anchor=i,n.kind="sequence",n.result=u,!0):!1}function Fe(n,r,e){var l,i,u,o,c,a,t=n.tag,p=n.anchor,f={},h=Object.create(null),d=null,m=null,x=null,A=!1,E=!1,g;if(n.firstTabInLine!==-1)return!1;for(n.anchor!==null&&(n.anchorMap[n.anchor]=f),g=n.input.charCodeAt(n.position);g!==0;){if(!A&&n.firstTabInLine!==-1&&(n.position=n.firstTabInLine,s(n,"tab characters must not be used in indentation")),l=n.input.charCodeAt(n.position+1),u=n.line,(g===63||g===58)&&S(l))g===63?(A&&(R(n,f,h,d,m,null,o,c,a),d=m=x=null),E=!0,A=!0,i=!0):A?(A=!1,i=!0):s(n,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),n.position+=1,g=l;else{if(o=n.line,c=n.lineStart,a=n.position,!B(n,e,qn,!1,!0))break;if(n.line===u){for(g=n.input.charCodeAt(n.position);L(g);)g=n.input.charCodeAt(++n.position);if(g===58)g=n.input.charCodeAt(++n.position),S(g)||s(n,"a whitespace character is expected after the key-value separator within a block mapping"),A&&(R(n,f,h,d,m,null,o,c,a),d=m=x=null),E=!0,A=!1,i=!1,d=n.tag,m=n.result;else if(E)s(n,"can not read an implicit mapping pair; a colon is missed");else return n.tag=t,n.anchor=p,!0}else if(E)s(n,"can not read a block mapping entry; a multiline key may not be an implicit key");else return n.tag=t,n.anchor=p,!0}if((n.line===u||n.lineIndent>r)&&(A&&(o=n.line,c=n.lineStart,a=n.position),B(n,r,G,!0,i)&&(A?m=n.result:x=n.result),A||(R(n,f,h,d,m,x,o,c,a),d=m=x=null),y(n,!0,-1),g=n.input.charCodeAt(n.position)),(n.line===u||n.lineIndent>r)&&g!==0)s(n,"bad indentation of a mapping entry");else if(n.lineIndent<r)break}return A&&R(n,f,h,d,m,null,o,c,a),E&&(n.tag=t,n.anchor=p,n.kind="mapping",n.result=f),E}function ke(n){var r,e=!1,l=!1,i,u,o;if(o=n.input.charCodeAt(n.position),o!==33)return!1;if(n.tag!==null&&s(n,"duplication of a tag property"),o=n.input.charCodeAt(++n.position),o===60?(e=!0,o=n.input.charCodeAt(++n.position)):o===33?(l=!0,i="!!",o=n.input.charCodeAt(++n.position)):i="!",r=n.position,e){do o=n.input.charCodeAt(++n.position);while(o!==0&&o!==62);n.position<n.length?(u=n.input.slice(r,n.position),o=n.input.charCodeAt(++n.position)):s(n,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!S(o);)o===33&&(l?s(n,"tag suffix cannot contain exclamation marks"):(i=n.input.slice(r-1,n.position+1),Qn.test(i)||s(n,"named tag handle cannot contain such characters"),l=!0,r=n.position+1)),o=n.input.charCodeAt(++n.position);u=n.input.slice(r,n.position),xe.test(u)&&s(n,"tag suffix cannot contain flow indicator characters")}u&&!zn.test(u)&&s(n,"tag name cannot contain such characters: "+u);try{u=decodeURIComponent(u)}catch{s(n,"tag name is malformed: "+u)}return e?n.tag=u:I.call(n.tagMap,i)?n.tag=n.tagMap[i]+u:i==="!"?n.tag="!"+u:i==="!!"?n.tag="tag:yaml.org,2002:"+u:s(n,'undeclared tag handle "'+i+'"'),!0}function Oe(n){var r,e;if(e=n.input.charCodeAt(n.position),e!==38)return!1;for(n.anchor!==null&&s(n,"duplication of an anchor property"),e=n.input.charCodeAt(++n.position),r=n.position;e!==0&&!S(e)&&!D(e);)e=n.input.charCodeAt(++n.position);return n.position===r&&s(n,"name of an anchor node must contain at least one character"),n.anchor=n.input.slice(r,n.position),!0}function Ie(n){var r,e,l;if(l=n.input.charCodeAt(n.position),l!==42)return!1;for(l=n.input.charCodeAt(++n.position),r=n.position;l!==0&&!S(l)&&!D(l);)l=n.input.charCodeAt(++n.position);return n.position===r&&s(n,"name of an alias node must contain at least one character"),e=n.input.slice(r,n.position),I.call(n.anchorMap,e)||s(n,'unidentified alias "'+e+'"'),n.result=n.anchorMap[e],y(n,!0,-1),!0}function B(n,r,e,l,i){var u,o,c,a=1,t=!1,p=!1,f,h,d,m,x,A;if(n.listener!==null&&n.listener("open",n),n.tag=null,n.anchor=null,n.kind=null,n.result=null,u=o=c=G===e||$n===e,l&&y(n,!0,-1)&&(t=!0,n.lineIndent>r?a=1:n.lineIndent===r?a=0:n.lineIndent<r&&(a=-1)),a===1)for(;ke(n)||Oe(n);)y(n,!0,-1)?(t=!0,c=u,n.lineIndent>r?a=1:n.lineIndent===r?a=0:n.lineIndent<r&&(a=-1)):c=!1;if(c&&(c=t||i),(a===1||G===e)&&(K===e||qn===e?x=r:x=r+1,A=n.position-n.lineStart,a===1?c&&(gn(n,A)||Fe(n,A,x))||Ee(n,x)?p=!0:(o&&Te(n,x)||_e(n,x)||Se(n,x)?p=!0:Ie(n)?(p=!0,(n.tag!==null||n.anchor!==null)&&s(n,"alias node should not have any properties")):we(n,x,K===e)&&(p=!0,n.tag===null&&(n.tag="?")),n.anchor!==null&&(n.anchorMap[n.anchor]=n.result)):a===0&&(p=c&&gn(n,A))),n.tag===null)n.anchor!==null&&(n.anchorMap[n.anchor]=n.result);else if(n.tag==="?"){for(n.result!==null&&n.kind!=="scalar"&&s(n,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+n.kind+'"'),f=0,h=n.implicitTypes.length;f<h;f+=1)if(m=n.implicitTypes[f],m.resolve(n.result)){n.result=m.construct(n.result),n.tag=m.tag,n.anchor!==null&&(n.anchorMap[n.anchor]=n.result);break}}else if(n.tag!=="!"){if(I.call(n.typeMap[n.kind||"fallback"],n.tag))m=n.typeMap[n.kind||"fallback"][n.tag];else for(m=null,d=n.typeMap.multi[n.kind||"fallback"],f=0,h=d.length;f<h;f+=1)if(n.tag.slice(0,d[f].tag.length)===d[f].tag){m=d[f];break}m||s(n,"unknown tag !<"+n.tag+">"),n.result!==null&&m.kind!==n.kind&&s(n,"unacceptable node kind for !<"+n.tag+'> tag; it should be "'+m.kind+'", not "'+n.kind+'"'),m.resolve(n.result,n.tag)?(n.result=m.construct(n.result,n.tag),n.anchor!==null&&(n.anchorMap[n.anchor]=n.result)):s(n,"cannot resolve a node with !<"+n.tag+"> explicit tag")}return n.listener!==null&&n.listener("close",n),n.tag!==null||n.anchor!==null||p}function Le(n){var r=n.position,e,l,i,u=!1,o;for(n.version=null,n.checkLineBreaks=n.legacy,n.tagMap=Object.create(null),n.anchorMap=Object.create(null);(o=n.input.charCodeAt(n.position))!==0&&(y(n,!0,-1),o=n.input.charCodeAt(n.position),!(n.lineIndent>0||o!==37));){for(u=!0,o=n.input.charCodeAt(++n.position),e=n.position;o!==0&&!S(o);)o=n.input.charCodeAt(++n.position);for(l=n.input.slice(e,n.position),i=[],l.length<1&&s(n,"directive name must not be less than one character in length");o!==0;){for(;L(o);)o=n.input.charCodeAt(++n.position);if(o===35){do o=n.input.charCodeAt(++n.position);while(o!==0&&!F(o));break}if(F(o))break;for(e=n.position;o!==0&&!S(o);)o=n.input.charCodeAt(++n.position);i.push(n.input.slice(e,n.position))}o!==0&&un(n),I.call(dn,l)?dn[l](n,l,i):W(n,'unknown document directive "'+l+'"')}if(y(n,!0,-1),n.lineIndent===0&&n.input.charCodeAt(n.position)===45&&n.input.charCodeAt(n.position+1)===45&&n.input.charCodeAt(n.position+2)===45?(n.position+=3,y(n,!0,-1)):u&&s(n,"directives end mark is expected"),B(n,n.lineIndent-1,G,!1,!0),y(n,!0,-1),n.checkLineBreaks&&ge.test(n.input.slice(r,n.position))&&W(n,"non-ASCII line breaks are interpreted as content"),n.documents.push(n.result),n.position===n.lineStart&&Q(n)){n.input.charCodeAt(n.position)===46&&(n.position+=3,y(n,!0,-1));return}if(n.position<n.length-1)s(n,"end of the stream or a document separator is expected");else return}function nr(n,r){n=String(n),r=r||{},n.length!==0&&(n.charCodeAt(n.length-1)!==10&&n.charCodeAt(n.length-1)!==13&&(n+=`
`),n.charCodeAt(0)===65279&&(n=n.slice(1)));var e=new Ce(n,r),l=n.indexOf("\0");for(l!==-1&&(e.position=l,s(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)Le(e);return e.documents}function Ne(n,r,e){r!==null&&typeof r=="object"&&typeof e>"u"&&(e=r,r=null);var l=nr(n,e);if(typeof r!="function")return l;for(var i=0,u=l.length;i<u;i+=1)r(l[i])}function Me(n,r){var e=nr(n,r);if(e.length!==0){if(e.length===1)return e[0];throw new _("expected a single document in the stream, but found more")}}var De=Ne,Re=Me,rr={loadAll:De,load:Re},er=Object.prototype.toString,ir=Object.prototype.hasOwnProperty,an=65279,Be=9,j=10,Ye=13,He=32,je=33,Pe=34,J=35,Ue=37,Ke=38,Ge=39,We=42,lr=44,qe=45,q=58,$e=61,Qe=62,ze=63,Ze=64,or=91,ur=93,Ve=96,cr=123,Xe=124,ar=125,w={};w[0]="\\0";w[7]="\\a";w[8]="\\b";w[9]="\\t";w[10]="\\n";w[11]="\\v";w[12]="\\f";w[13]="\\r";w[27]="\\e";w[34]='\\"';w[92]="\\\\";w[133]="\\N";w[160]="\\_";w[8232]="\\L";w[8233]="\\P";var Je=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],ni=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function ri(n,r){var e,l,i,u,o,c,a;if(r===null)return{};for(e={},l=Object.keys(r),i=0,u=l.length;i<u;i+=1)o=l[i],c=String(r[o]),o.slice(0,2)==="!!"&&(o="tag:yaml.org,2002:"+o.slice(2)),a=n.compiledTypeMap.fallback[o],a&&ir.call(a.styleAliases,c)&&(c=a.styleAliases[c]),e[o]=c;return e}function ei(n){var r,e,l;if(r=n.toString(16).toUpperCase(),n<=255)e="x",l=2;else if(n<=65535)e="u",l=4;else if(n<=4294967295)e="U",l=8;else throw new _("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+b.repeat("0",l-r.length)+r}var ii=1,P=2;function li(n){this.schema=n.schema||on,this.indent=Math.max(1,n.indent||2),this.noArrayIndent=n.noArrayIndent||!1,this.skipInvalid=n.skipInvalid||!1,this.flowLevel=b.isNothing(n.flowLevel)?-1:n.flowLevel,this.styleMap=ri(this.schema,n.styles||null),this.sortKeys=n.sortKeys||!1,this.lineWidth=n.lineWidth||80,this.noRefs=n.noRefs||!1,this.noCompatMode=n.noCompatMode||!1,this.condenseFlow=n.condenseFlow||!1,this.quotingType=n.quotingType==='"'?P:ii,this.forceQuotes=n.forceQuotes||!1,this.replacer=typeof n.replacer=="function"?n.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function xn(n,r){for(var e=b.repeat(" ",r),l=0,i=-1,u="",o,c=n.length;l<c;)i=n.indexOf(`
`,l),i===-1?(o=n.slice(l),l=c):(o=n.slice(l,i+1),l=i+1),o.length&&o!==`
`&&(u+=e),u+=o;return u}function nn(n,r){return`
`+b.repeat(" ",n.indent*r)}function oi(n,r){var e,l,i;for(e=0,l=n.implicitTypes.length;e<l;e+=1)if(i=n.implicitTypes[e],i.resolve(r))return!0;return!1}function $(n){return n===He||n===Be}function U(n){return 32<=n&&n<=126||161<=n&&n<=55295&&n!==8232&&n!==8233||57344<=n&&n<=65533&&n!==an||65536<=n&&n<=1114111}function An(n){return U(n)&&n!==an&&n!==Ye&&n!==j}function vn(n,r,e){var l=An(n),i=l&&!$(n);return(e?l:l&&n!==lr&&n!==or&&n!==ur&&n!==cr&&n!==ar)&&n!==J&&!(r===q&&!i)||An(r)&&!$(r)&&n===J||r===q&&i}function ui(n){return U(n)&&n!==an&&!$(n)&&n!==qe&&n!==ze&&n!==q&&n!==lr&&n!==or&&n!==ur&&n!==cr&&n!==ar&&n!==J&&n!==Ke&&n!==We&&n!==je&&n!==Xe&&n!==$e&&n!==Qe&&n!==Ge&&n!==Pe&&n!==Ue&&n!==Ze&&n!==Ve}function ci(n){return!$(n)&&n!==q}function Y(n,r){var e=n.charCodeAt(r),l;return e>=55296&&e<=56319&&r+1<n.length&&(l=n.charCodeAt(r+1),l>=56320&&l<=57343)?(e-55296)*1024+l-56320+65536:e}function tr(n){var r=/^\n* /;return r.test(n)}var fr=1,rn=2,pr=3,sr=4,M=5;function ai(n,r,e,l,i,u,o,c){var a,t=0,p=null,f=!1,h=!1,d=l!==-1,m=-1,x=ui(Y(n,0))&&ci(Y(n,n.length-1));if(r||o)for(a=0;a<n.length;t>=65536?a+=2:a++){if(t=Y(n,a),!U(t))return M;x=x&&vn(t,p,c),p=t}else{for(a=0;a<n.length;t>=65536?a+=2:a++){if(t=Y(n,a),t===j)f=!0,d&&(h=h||a-m-1>l&&n[m+1]!==" ",m=a);else if(!U(t))return M;x=x&&vn(t,p,c),p=t}h=h||d&&a-m-1>l&&n[m+1]!==" "}return!f&&!h?x&&!o&&!i(n)?fr:u===P?M:rn:e>9&&tr(n)?M:o?u===P?M:rn:h?sr:pr}function ti(n,r,e,l,i){n.dump=(function(){if(r.length===0)return n.quotingType===P?'""':"''";if(!n.noCompatMode&&(Je.indexOf(r)!==-1||ni.test(r)))return n.quotingType===P?'"'+r+'"':"'"+r+"'";var u=n.indent*Math.max(1,e),o=n.lineWidth===-1?-1:Math.max(Math.min(n.lineWidth,40),n.lineWidth-u),c=l||n.flowLevel>-1&&e>=n.flowLevel;function a(t){return oi(n,t)}switch(ai(r,c,n.indent,o,a,n.quotingType,n.forceQuotes&&!l,i)){case fr:return r;case rn:return"'"+r.replace(/'/g,"''")+"'";case pr:return"|"+yn(r,n.indent)+bn(xn(r,u));case sr:return">"+yn(r,n.indent)+bn(xn(fi(r,o),u));case M:return'"'+pi(r)+'"';default:throw new _("impossible error: invalid scalar style")}})()}function yn(n,r){var e=tr(n)?String(r):"",l=n[n.length-1]===`
`,i=l&&(n[n.length-2]===`
`||n===`
`),u=i?"+":l?"":"-";return e+u+`
`}function bn(n){return n[n.length-1]===`
`?n.slice(0,-1):n}function fi(n,r){for(var e=/(\n+)([^\n]*)/g,l=(function(){var t=n.indexOf(`
`);return t=t!==-1?t:n.length,e.lastIndex=t,Cn(n.slice(0,t),r)})(),i=n[0]===`
`||n[0]===" ",u,o;o=e.exec(n);){var c=o[1],a=o[2];u=a[0]===" ",l+=c+(!i&&!u&&a!==""?`
`:"")+Cn(a,r),i=u}return l}function Cn(n,r){if(n===""||n[0]===" ")return n;for(var e=/ [^ ]/g,l,i=0,u,o=0,c=0,a="";l=e.exec(n);)c=l.index,c-i>r&&(u=o>i?o:c,a+=`
`+n.slice(i,u),i=u+1),o=c;return a+=`
`,n.length-i>r&&o>i?a+=n.slice(i,o)+`
`+n.slice(o+1):a+=n.slice(i),a.slice(1)}function pi(n){for(var r="",e=0,l,i=0;i<n.length;e>=65536?i+=2:i++)e=Y(n,i),l=w[e],!l&&U(e)?(r+=n[i],e>=65536&&(r+=n[i+1])):r+=l||ei(e);return r}function si(n,r,e){var l="",i=n.tag,u,o,c;for(u=0,o=e.length;u<o;u+=1)c=e[u],n.replacer&&(c=n.replacer.call(e,String(u),c)),(k(n,r,c,!1,!1)||typeof c>"u"&&k(n,r,null,!1,!1))&&(l!==""&&(l+=","+(n.condenseFlow?"":" ")),l+=n.dump);n.tag=i,n.dump="["+l+"]"}function wn(n,r,e,l){var i="",u=n.tag,o,c,a;for(o=0,c=e.length;o<c;o+=1)a=e[o],n.replacer&&(a=n.replacer.call(e,String(o),a)),(k(n,r+1,a,!0,!0,!1,!0)||typeof a>"u"&&k(n,r+1,null,!0,!0,!1,!0))&&((!l||i!=="")&&(i+=nn(n,r)),n.dump&&j===n.dump.charCodeAt(0)?i+="-":i+="- ",i+=n.dump);n.tag=u,n.dump=i||"[]"}function hi(n,r,e){var l="",i=n.tag,u=Object.keys(e),o,c,a,t,p;for(o=0,c=u.length;o<c;o+=1)p="",l!==""&&(p+=", "),n.condenseFlow&&(p+='"'),a=u[o],t=e[a],n.replacer&&(t=n.replacer.call(e,a,t)),k(n,r,a,!1,!1)&&(n.dump.length>1024&&(p+="? "),p+=n.dump+(n.condenseFlow?'"':"")+":"+(n.condenseFlow?"":" "),k(n,r,t,!1,!1)&&(p+=n.dump,l+=p));n.tag=i,n.dump="{"+l+"}"}function di(n,r,e,l){var i="",u=n.tag,o=Object.keys(e),c,a,t,p,f,h;if(n.sortKeys===!0)o.sort();else if(typeof n.sortKeys=="function")o.sort(n.sortKeys);else if(n.sortKeys)throw new _("sortKeys must be a boolean or a function");for(c=0,a=o.length;c<a;c+=1)h="",(!l||i!=="")&&(h+=nn(n,r)),t=o[c],p=e[t],n.replacer&&(p=n.replacer.call(e,t,p)),k(n,r+1,t,!0,!0,!0)&&(f=n.tag!==null&&n.tag!=="?"||n.dump&&n.dump.length>1024,f&&(n.dump&&j===n.dump.charCodeAt(0)?h+="?":h+="? "),h+=n.dump,f&&(h+=nn(n,r)),k(n,r+1,p,!0,f)&&(n.dump&&j===n.dump.charCodeAt(0)?h+=":":h+=": ",h+=n.dump,i+=h));n.tag=u,n.dump=i||"{}"}function _n(n,r,e){var l,i,u,o,c,a;for(i=e?n.explicitTypes:n.implicitTypes,u=0,o=i.length;u<o;u+=1)if(c=i[u],(c.instanceOf||c.predicate)&&(!c.instanceOf||typeof r=="object"&&r instanceof c.instanceOf)&&(!c.predicate||c.predicate(r))){if(e?c.multi&&c.representName?n.tag=c.representName(r):n.tag=c.tag:n.tag="?",c.represent){if(a=n.styleMap[c.tag]||c.defaultStyle,er.call(c.represent)==="[object Function]")l=c.represent(r,a);else if(ir.call(c.represent,a))l=c.represent[a](r,a);else throw new _("!<"+c.tag+'> tag resolver accepts not "'+a+'" style');n.dump=l}return!0}return!1}function k(n,r,e,l,i,u,o){n.tag=null,n.dump=e,_n(n,e,!1)||_n(n,e,!0);var c=er.call(n.dump),a=l,t;l&&(l=n.flowLevel<0||n.flowLevel>r);var p=c==="[object Object]"||c==="[object Array]",f,h;if(p&&(f=n.duplicates.indexOf(e),h=f!==-1),(n.tag!==null&&n.tag!=="?"||h||n.indent!==2&&r>0)&&(i=!1),h&&n.usedDuplicates[f])n.dump="*ref_"+f;else{if(p&&h&&!n.usedDuplicates[f]&&(n.usedDuplicates[f]=!0),c==="[object Object]")l&&Object.keys(n.dump).length!==0?(di(n,r,n.dump,i),h&&(n.dump="&ref_"+f+n.dump)):(hi(n,r,n.dump),h&&(n.dump="&ref_"+f+" "+n.dump));else if(c==="[object Array]")l&&n.dump.length!==0?(n.noArrayIndent&&!o&&r>0?wn(n,r-1,n.dump,i):wn(n,r,n.dump,i),h&&(n.dump="&ref_"+f+n.dump)):(si(n,r,n.dump),h&&(n.dump="&ref_"+f+" "+n.dump));else if(c==="[object String]")n.tag!=="?"&&ti(n,n.dump,r,u,a);else{if(c==="[object Undefined]")return!1;if(n.skipInvalid)return!1;throw new _("unacceptable kind of an object to dump "+c)}n.tag!==null&&n.tag!=="?"&&(t=encodeURI(n.tag[0]==="!"?n.tag.slice(1):n.tag).replace(/!/g,"%21"),n.tag[0]==="!"?t="!"+t:t.slice(0,18)==="tag:yaml.org,2002:"?t="!!"+t.slice(18):t="!<"+t+">",n.dump=t+" "+n.dump)}return!0}function mi(n,r){var e=[],l=[],i,u;for(en(n,e,l),i=0,u=l.length;i<u;i+=1)r.duplicates.push(e[l[i]]);r.usedDuplicates=new Array(u)}function en(n,r,e){var l,i,u;if(n!==null&&typeof n=="object")if(i=r.indexOf(n),i!==-1)e.indexOf(i)===-1&&e.push(i);else if(r.push(n),Array.isArray(n))for(i=0,u=n.length;i<u;i+=1)en(n[i],r,e);else for(l=Object.keys(n),i=0,u=l.length;i<u;i+=1)en(n[l[i]],r,e)}function gi(n,r){r=r||{};var e=new li(r);e.noRefs||mi(n,e);var l=n;return e.replacer&&(l=e.replacer.call({"":l},"",l)),k(e,0,l,!0,!0)?e.dump+`
`:""}var xi=gi,Ai={dump:xi};function tn(n,r){return function(){throw new Error("Function yaml."+n+" is removed in js-yaml 4. Use yaml."+r+" instead, which is now safe by default.")}}var vi=C,yi=Tn,bi=In,Ci=Rn,wi=Bn,_i=on,Si=rr.load,Ei=rr.loadAll,Ti=Ai.dump,Fi=_,ki={binary:Un,float:Dn,map:On,null:Ln,pairs:Gn,set:Wn,timestamp:jn,bool:Nn,int:Mn,merge:Pn,omap:Kn,seq:kn,str:Fn},Oi=tn("safeLoad","load"),Ii=tn("safeLoadAll","loadAll"),Li=tn("safeDump","dump"),Ni={Type:vi,Schema:yi,FAILSAFE_SCHEMA:bi,JSON_SCHEMA:Ci,CORE_SCHEMA:wi,DEFAULT_SCHEMA:_i,load:Si,loadAll:Ei,dump:Ti,YAMLException:Fi,types:ki,safeLoad:Oi,safeLoadAll:Ii,safeDump:Li},T=(n=>(n[n.Home=0]="Home",n[n.Archive=1]="Archive",n[n.Projects=2]="Projects",n[n.Skills=3]="Skills",n[n.Timeline=4]="Timeline",n[n.Diary=5]="Diary",n[n.Albums=6]="Albums",n[n.Anime=7]="Anime",n[n.About=8]="About",n[n.Friends=9]="Friends",n))(T||{});const Mi=`# 站点配置\r
site:\r
    # 站点 URL（以斜杠结尾）\r
    siteURL: "https://twilight.spr-aachen.com/"   # ⚠️ 请改为你的根域名，例如 https://tussalzeus18028.github.io\r
    # 站点标题\r
    title: "Twilight"\r
    # 站点副标题\r
    subtitle: "Blog Template"\r
    # 语言配置\r
    lang: "en"\r
    # 翻译配置\r
    translate:\r
        # 启用翻译功能\r
        enable: true\r
        # 翻译服务\r
        service: "client.edge"\r
        # 显示语言选择下拉框\r
        showSelectTag: false\r
        # 自动检测用户语言\r
        autoDiscriminate: true\r
        # 翻译时忽略的 CSS 类名\r
        ignoreClasses:\r
            - "ignore"\r
            - "banner-title"\r
            - "banner-subtitle"\r
        # 翻译时忽略的 HTML 标签\r
        ignoreTags:\r
            - "script"\r
            - "style"\r
            - "code"\r
            - "pre"\r
    # 时区配置\r
    timeZone: 8\r
    # 字体配置\r
    font:\r
        # 示例字体配置 - Zen Maru Gothic\r
        "Example - ZenMaruGothic":\r
            # 字体源 (字体 CSS 链接 | 字体文件路径)\r
            src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic&display=swap"\r
            # 字体名 (font-family)\r
            family: "Zen Maru Gothic"\r
    # 主题色配置\r
    themeColor:\r
        # 主题色的默认色相 (范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345)\r
        hue: 255\r
    # 默认主题 ("system" 跟随系统 | "light" 浅色 | "dark" 深色)\r
    defaultTheme: "dark"\r
    # 壁纸配置\r
    wallpaper:\r
        # 模式 ("banner" 横幅 | "fullscreen" 全屏 | "none" 纯色)\r
        mode: "banner"\r
        # 图片源配置 (fullscreen 和 banner 模式共享)\r
        src:\r
            # 桌面壁纸图片 (相对于 /public 目录; 支持单张图片或图片数组，当数组长度 > 1 时自动启用轮播)\r
            desktop:\r
                - "/assets/images/desktopWallpaper_1.jpg"\r
                - "/assets/images/desktopWallpaper_2.jpg"\r
                - "/assets/images/desktopWallpaper_3.jpg"\r
            # 移动壁纸图片 (相对于 /public 目录; 支持单张图片或图片数组，当数组长度 > 1 时自动启用轮播)\r
            mobile:\r
                - "/assets/images/mobileWallpaper_1.jpg"\r
                - "/assets/images/mobileWallpaper_2.jpg"\r
        # 壁纸位置 ('top' | 'center' | 'bottom')\r
        position: "center"\r
        # 轮播配置 (fullscreen 和 banner 模式共享)\r
        carousel:\r
            # 为多张图片启用轮播，否则随机显示一张图片\r
            enable: true\r
            # 轮播间隔时间 (秒)\r
            interval: 3.6\r
            # 启用 Ken Burns 效果\r
            kenBurns: true\r
        # Banner 模式专属配置\r
        banner:\r
            # 横幅文本配置\r
            homeText:\r
                # 在主页显示文本\r
                enable: true\r
                # 主标题\r
                title: "Twilight"\r
                # 副标题，支持单个字符串或字符串数组\r
                subtitle:\r
                    - "Illuminate Our Paths"\r
                # 副标题打字机效果\r
                typewriter:\r
                    # 启用副标题打字机效果\r
                    enable: true\r
                    # 打字速度 (毫秒)\r
                    speed: 111\r
                    # 删除速度 (毫秒)\r
                    deleteSpeed: 51\r
                    # 完全显示后的暂停时间 (毫秒)\r
                    pauseTime: 3000\r
            # 横幅图片来源文本\r
            credit:\r
                # 显示横幅图片来源文本\r
                enable: false\r
                # 要显示的来源文本\r
                text: "Describe"\r
                # (可选) 原始艺术品或艺术家页面的 URL 链接\r
                url: ""\r
            # 导航栏配置\r
            navbar:\r
                # 导航栏透明模式 ("semi" 半透明加圆角 | "full" 完全透明 | "semifull" 动态透明)\r
                transparentMode: "semifull"\r
            # 水波纹效果配置\r
            waves:\r
                # 启用水波纹效果\r
                enable: true\r
                # 启用性能模式 (简化波浪效果以提升性能)\r
                performanceMode: false\r
        # Fullscreen 模式专属配置\r
        fullscreen:\r
            # 层级\r
            zIndex: -1\r
            # 壁纸透明度，0-1之间\r
            opacity: 0.9\r
            # 背景模糊程度 (像素值)\r
            blur: 1\r
            # 导航栏透明模式\r
            navbar:\r
                transparentMode: "semi"\r
    # 加载页配置\r
    loadingOverlay:\r
        # 是否启用加载页\r
        enable: true\r
        # 是否等待所有资源 (如图片、样式表) 加载完成\r
        waitForAllResources: true\r
        # 加载标题配置\r
        title:\r
            # 是否启用加载标题\r
            enable: true\r
            # 加载标题文本\r
            content: "LOADING"\r
            # 动画周期 (s)\r
            interval: 1.5\r
        # 加载动画配置\r
        spinner:\r
            # 是否启用加载动画\r
            enable: true\r
            # 动画周期 (s)\r
            interval: 1.5\r
    # favicon 配置\r
    favicon: []\r
    # bangumi 配置\r
    bangumi:\r
        # 用户 ID\r
        userId: "your-bangumi-id"\r
    # OpenGraph 配置\r
    generateOgImages: false\r
\r
# Umami统计配置\r
umami:\r
    # 是否显示Umami统计\r
    enabled: false\r
    # UmamiCloudAPI地址\r
    baseUrl: "https://api.umami.is"\r
    # API密钥 (可用环境变量覆盖)\r
    apiKey: ""\r
    # 要插入的Script (可用环境变量覆盖)\r
    scripts: ""\r
\r
# 导航栏配置\r
navbar:\r
    # 链接配置 (链接预设位于 src/constants/link-presets.ts 的 LinkPresets)\r
    links:\r
        - # 一级导航链接 - 主页 (预设)\r
            "Home"\r
        - # 一级导航链接 - 归档 (预设)\r
            "Archive"\r
        - # 一级导航链接 - 展览 (自定义)\r
            # 导航名称\r
            name: "Exhibition"\r
            # 导航链接\r
            url: "/exhibition/"\r
            # 导航图标\r
            icon: "material-symbols:person"\r
            # 导航描述\r
            description: "A collection of my creative works and experiences"\r
            # 子链接\r
            children:\r
                - # 二级导航链接 - 项目 (预设)\r
                    "Projects"\r
                - # 二级导航链接 - 技能 (预设)\r
                    "Skills"\r
                - # 二级导航链接 - 历程 (预设)\r
                    "Timeline"\r
                - # 二级导航链接 - 日记 (预设)\r
                    "Diary"\r
                - # 二级导航链接 - 相册 (预设)\r
                    "Albums"\r
                - # 二级导航链接 - 动画 (预设)\r
                    "Anime"\r
        - # 一级导航链接 - 好友 (预设)\r
            "Friends"\r
        - # 一级导航链接 - 关于 (预设)\r
            "About"\r
\r
# 侧边栏配置\r
sidebar:\r
    # 侧边栏组件配置列表 (侧栏组件预设位于 src/types/config.ts 的 WidgetComponentType)\r
    components:\r
        # 左侧侧边栏\r
        left:\r
            - # 组件 - 资料 (预设)\r
                # 类型\r
                type: "profile"\r
                # 位置策略 ("top" 顶部固定 | "sticky" 粘性)\r
                position: "top"\r
            - # 组件 - 公告 (预设)\r
                # 类型\r
                type: "announcement"\r
                # 位置策略 ("top" 顶部固定 | "sticky" 粘性)\r
                position: "top"\r
            - # 组件 - 文章类别 (预设)\r
                # 类型\r
                type: "categories"\r
                # 位置策略 ("top" 顶部固定 | "sticky" 粘性)\r
                position: "sticky"\r
                # 响应式配置\r
                responsive:\r
                    # 折叠阈值\r
                    collapseThreshold: 5\r
                # 目录深度\r
                depth: 3\r
            - # 组件 - 文章标签 (预设)\r
                # 类型\r
                type: "tags"\r
                # 位置策略 ("top" 顶部固定 | "sticky" 粘性)\r
                position: "sticky"\r
                # 响应式配置\r
                responsive:\r
                    # 折叠阈值\r
                    collapseThreshold: 20\r
        # 右侧侧边栏\r
        right:\r
            - # 组件 - 文章目录 (预设)\r
                # 类型\r
                type: "toc"\r
                # 位置策略 ("top" 顶部固定 | "sticky" 粘性)\r
                position: "sticky"\r
                # 目录深度 (1-6，1 表示只显示 h1 标题，2 表示显示 h1 和 h2 标题，依此类推)\r
                depth: 3\r
            - # 组件 - 文章统计 (预设)\r
                # 类型\r
                type: "statistics"\r
                # 位置策略 ("top" 顶部固定 | "sticky" 粘性)\r
                position: "sticky"\r
                # 页面可见性配置\r
                visibility:\r
                    # 匹配模式：'include' (包含), 'exclude' (排除)\r
                    mode: "include"\r
                    # 页面路径匹配规则列表 (支持正则字符串)\r
                    paths: ["^/$", "^/archive$"]\r
\r
# 资料配置\r
profile:\r
    # 头像配置 (相对于 /public 目录)\r
    avatar: "/assets/images/avatar.jpg"\r
    # 信息配置\r
    name: "Twilight"\r
    # 简介配置\r
    bio: "Hi"\r
    # 链接配置\r
    links:\r
        - # 链接示例\r
            # 名字\r
            name: "GitHub"\r
            # 图标\r
            icon: "fa6-brands:github"\r
            # 链接\r
            url: "https://github.com/Spr-Aachen/Twilight"\r
\r
# 公告配置\r
announcement:\r
    # 公告标题\r
    title: "Announcement"\r
    # 公告内容\r
    content: "Welcome to my blog!"\r
    # 允许用户关闭公告\r
    closable: true\r
    # 链接配置\r
    link:\r
        # 启用链接\r
        enable: true\r
        # 链接文本\r
        text: "Learn More"\r
        # 链接 URL\r
        url: "/about/"\r
        # 是否外部链接\r
        external: false\r
\r
# 文章配置\r
post:\r
    # 显示“上次编辑”卡片\r
    showLastModified: true\r
    # 代码高亮配置\r
    expressiveCode:\r
        # 主题\r
        theme: "github-dark"\r
    # 许可证配置\r
    license:\r
        # 启用许可证\r
        enable: true\r
        # 许可证名称\r
        name: "CC BY-NC-SA 4.0"\r
        # 许可证链接\r
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"\r
    # 评论配置\r
    comment:\r
        # 启用评论功能\r
        enable: false\r
        # Twikoo 评论系统配置\r
        twikoo:\r
            # 环境 ID\r
            envId: "https://twikoo.vercel.app"\r
            # 语言\r
            lang: "en"\r
\r
# 页脚配置\r
footer:\r
    # 启用 Footer HTML 注入功能\r
    enable: false\r
    # 自定义 HTML 内容，用于添加备案号等信息\r
    customHtml: ""\r
\r
# 粒子特效配置\r
particle:\r
    # 启用粒子特效\r
    enable: true\r
    # 粒子数量\r
    particleNum: 12\r
    # 粒子越界限制次数，-1为无限循环\r
    limitTimes: -1\r
    # 粒子尺寸配置\r
    size:\r
        # 粒子最小尺寸倍数\r
        min: 0.3\r
        # 粒子最大尺寸倍数\r
        max: 0.9\r
    # 粒子透明度配置\r
    opacity:\r
        # 粒子最小不透明度\r
        min: 0.3\r
        # 粒子最大不透明度\r
        max: 0.9\r
    # 粒子移动速度配置\r
    speed:\r
        # 水平移动速度\r
        horizontal:\r
            # 最小值\r
            min: -0.9\r
            # 最大值\r
            max: 0.9\r
        # 垂直移动速度\r
        vertical:\r
            # 最小值\r
            min: 0.15\r
            # 最大值\r
            max: 0.3\r
        # 旋转速度\r
        rotation: 0.12\r
        # 消失速度\r
        fadeSpeed: 0.12\r
    # 粒子层级\r
    zIndex: 100\r
\r
# 音乐播放器配置\r
musicPlayer:\r
    # 启用音乐播放器功能\r
    enable: true\r
    # 默认模式 ("meting" API | "local" 本地)\r
    mode: "meting"\r
    # meting 模式专属配置\r
    meting:\r
        # Meting API 地址\r
        meting_api: "https://api.i-meto.com/meting/api"\r
        # 音乐平台\r
        server: "netease"\r
        # 类型 ("playlist" 歌单 | "song" 单曲)\r
        type: "playlist"\r
        # 资源 ID\r
        id: "2161912966"\r
    # local 模式专属配置\r
    local:\r
        # 播放列表\r
        playlist:\r
            - # 列表示例\r
                # 序号\r
                id: 1\r
                # 标题\r
                title: "深海之息"\r
                # 作者\r
                artist: "Youzee Music"\r
                # 封面\r
                cover: "https://p1.music.126.net/PhKOqFtljgHDDpKYM2ADUA==/109951169858309716.jpg"\r
                # 音乐路径\r
                url: "assets/music/深海之息.m4a"\r
                # 歌词路径\r
                lrc: "assets/music/深海之息.lrc"\r
                # 时长\r
                duration: 146\r
    # 是否自动播放\r
    autoplay: true\r
\r
# 看板娘配置\r
pio:\r
    # 启用看板娘\r
    enable: false\r
    # 模型文件路径\r
    models:\r
        - "/pio/models/pio/model.json"\r
    # 看板娘位置\r
    position: "left"\r
    # 看板娘宽度\r
    width: 280\r
    # 看板娘高度\r
    height: 250\r
    # 展现模式\r
    mode: "draggable"\r
    # 是否在移动设备上隐藏\r
    hiddenOnMobile: true\r
    # 对话框配置\r
    dialog:\r
        # 欢迎词\r
        welcome: "Welcome!"\r
        # 触摸提示\r
        touch:\r
            - "What are you doing?"\r
            - "Stop touching me!"\r
            - "Don't bully me like that!"\r
            - "(｡í _ ì｡)"\r
        # 首页提示\r
        home: "Click here to go back to homepage!"\r
        # 换装提示\r
        skin:\r
            - "Want to see my new outfit?"\r
            - "The new outfit looks great~"\r
        # 关闭提示\r
        close: "See you next time~"\r
        # 关于链接\r
        link: "https://nav.kungal.org"`,v=Ni.load(Mi),Di={Home:T.Home,Archive:T.Archive,Projects:T.Projects,Skills:T.Skills,Timeline:T.Timeline,Diary:T.Diary,Albums:T.Albums,Anime:T.Anime,About:T.About,Friends:T.Friends},hr=n=>{if(typeof n=="string"){const e=Di[n];if(e===void 0)throw new Error(`Unknown LinkPreset: ${n}`);return e}if(typeof n=="number")return n;const r=n.children?.map(hr);return r?{...n,children:r}:n},Ri=n=>n.map(hr);({...v.post,comment:v.post.comment.twikoo?{...v.post.comment,twikoo:{...v.post.comment.twikoo,lang:v.post.comment.twikoo.lang??v.site.lang}}:v.post.comment});const Bi=v.site;v.umami.enabled,v.umami.apiKey,v.umami.baseUrl,v.umami.scripts;Ri(v.navbar.links);const Yi=v.sidebar;v.profile;v.announcement;v.footer;const Hi=v.particle,ji=v.musicPlayer,Pi=v.pio;export{T as L,Yi as a,Hi as b,ji as m,Pi as p,Bi as s};
