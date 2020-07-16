var insect = document.getElementById("yy1").innerText;
var scientific_name = document.getElementById("yy2").innerText;
var insect_color = document.getElementById("yy3").innerText;
var flower = document.getElementById("yy4").innerText;
var flower_color = document.getElementById("yy5").innerText;
var parameter = document.getElementById("yy6").innerText;
var date2 = document.getElementById("yy7").innerText;
var date = document.getElementById("yy8").innerText;
// console.log(insect);
// console.log(scientific_name);
// console.log(insect_color);
// console.log(flower);
// console.log(flower_color);
// console.log(parameter);
// console.log(date2);
// console.log(date);
var images = document.getElementById('yy9').innerText;
images = images.replace(/\s+/g, '');
images = images.split(',');
var flag = false;
//console.log(images);
// var fset = new Set();
// var fcset = new Set();
// var inset = new Set();
// var snset = new Set();
// var icset = new Set();
var count = 0;
var htmlCode='<div class="row">';
for(var i=1;i<images.length;i++){
    var us1 = images[i].indexOf('_');
    var us2 = images[i].indexOf('_',us1+1);
    var us3 = images[i].indexOf('_',us2+1);
    var us4 = images[i].indexOf('_',us3+1);
    var us5 = images[i].indexOf('_',us4+1);
    var us6 = images[i].indexOf('_',us5+1);
    var f = images[i].slice(0,us1);
    var fc = images[i].slice(us1+1,us2);
    var ins = images[i].slice(us2+1,us3);
    var sn = images[i].slice(us3+1,us4);
    var ic = images[i].slice(us4+1,us5);
    var da = images[i].slice(us5+1,us6);
    // fset.add(f);
    // fcset.add(fc);
    // inset.add(ins);
    // snset.add(sn);
    // icset.add(ic);
    // if(count==0){
    //     htmlCode+='<div class="row">';
    // }
    if(count<4){
        if(f!=flower&&flower!='Open this select menu'){
            continue;
        }
        if(fc!=flower_color&&flower_color!='Open this select menu'){
            continue;
        }
        if(ins!=insect&&insect!='Open this select menu'){
            continue;
        }
        if(sn!=scientific_name&&scientific_name!='Open this select menu'){
            continue;
        }
        if(ic!=insect_color&&insect_color!='Open this select menu'){
            continue;
        }
        var year = parseInt(da.slice(0,4));
        var month = parseInt(da.slice(4,6));
        var day = parseInt(da.slice(6,8));
        if(date2!=''){
            var m2 = parseInt(date2.slice(0,2)) ;
            var d2 = parseInt(date2.slice(3,5));
            var y3 = parseInt(date2.slice(6,10));
            if(year<y3||(year==y3&&month<m2)||(year==y3&&month==m2&&day<d2)){
                continue;
            }
        }
        if(date!=''){
            var m2 = parseInt(date.slice(0,2)) ;
            var d2 = parseInt(date.slice(3,5));
            var y3 = parseInt(date.slice(6,10));
            if(year>y3||(year==y3&&month>m2)||(year==y3&&month==m2&&day>d2)){
                continue;
            }
        }
        
        htmlCode+='<div class="col col-3">\
        <div class="card">\
          <a href="/users/description"> <img src=../images/'+ images[i] +' class="card-img-top" alt="..."> </a>\
          <div class="card-body">\
            <h5 class="card-title">Lorem ipsum</h5>\
            <p class="card-text">Lorem Ipsum</p>\
          </div>\
          </div>\
        </div>';
        // console.log(images[i]);
        count++;
    }if(count==4){
        // htmlCode+='</div>';
        count=0;
    }
}htmlCode+='</div>';
// console.log(count);
// console.log(fset);
// console.log(fcset);
// console.log(icset);
// console.log(snset);
// console.log(inset);
$('#card-list').append(htmlCode);