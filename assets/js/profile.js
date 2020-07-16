var x = document.getElementById("yy").innerText;
var y = JSON.parse(x);
var arr = y['uploads'];
console.log(arr);
var dates = [];
function month(n) {
    if (n==1) {return "January";}
    if (n==2) {return "February";}
    if (n==3) {return "March";}
    if (n==4) {return "April";}
    if (n==5) {return "May";}
    if (n==6) {return "June";}
    if (n==7) {return "July";}
    if (n==8) {return "August";}
    if (n==9) {return "September";}
    if (n==10) {return "October";}
    if (n==11) {return "November";}
    if (n==12) {return "December";}
}
for (let i in arr) {
    var file_name = arr[i];
    var index = file_name.indexOf('_');
    var date = file_name.substring(index+1, index+9);
    var mo = parseInt(date.substring(2,4));
    var yr = date.substring(4,8);
    var temp = [];
    temp.push(month(parseInt(mo)));
    temp.push(yr);
    dates.push(temp);
}

console.log(dates);

var ymMap = new Map();
for(var i=0;i<dates.length;i++){
    ymMap.set(dates[i][1],new Array(12));
}

console.log(ymMap);

for(var i=0;i<dates.length;i++){
    for(var j=1;j<13;j++){
        if(dates[i][0]==month(j)){
            ymMap.get(dates[i][1])[j-1]=1;
        }    
    }
}

var htmlCode = '';
for(var y=1995;y<2100;y++){
    var year=y.toString();
    if(ymMap.has(year)){
        for(var j=0;j<12;j++){
            if(ymMap.get(year)[j]==1){
                htmlCode+='<h2>'+month(j+1)+" "+year+'</h2><div class="row">';
                for(var i=0;i<dates.length;i++){
                    if(dates[i][1]==year){
                        if(dates[i][0]==month(j+1)){
                            
                            htmlCode+='<div class="col col-3">  <div class="card"><img src='+arr[i]+' class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">Lorem ipsum</h5><p class="card-text">Lorem ipsum</p></div></div></div>';
            
                        }
                    }
                }htmlCode+="</div><hr>";
            }
        }
    }
}
$('#card-list').prepend(htmlCode);