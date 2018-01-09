var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var arr = [];
app.get('/scrape', function (req, res) {
    // Let's scrape Anchorman 2
    url = 'https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=1&page=1';

    request(url, function (error, response, html) {
        //console.log(response)
        console.log(html)
        obj = JSON.parse(html);
        url1 = 'https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=1&page=2';
        request(url1, function (error, response, html1) {
            console.log(html1)
            obj1 = JSON.parse(html1);
            url2 = 'https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=1&page=3';
            request(url2, function (error, response, html2) {
                console.log(html2)
                obj2 = JSON.parse(html2);
                var cobj = obj.menus.concat(obj1.menus).concat(obj2.menus)
                // console.log(obj.menus);
                checkIfparentId(obj)
                checkIfparentId(obj1)
                checkIfparentId(obj2)
                for (i = 0; i < arr.length; i++)
                    console.log("arr=" + arr[i])

                var json_show=dfs(0,cobj)
                res.send(json_show)
            })
        })

// expected output: 42

        console.log(obj.pagination);



    })
})

function checkIfparentId(ob) {
    for (var i = 0; i < ob.menus.length; i++) {
        var obje = ob.menus[i];
        console.log(obje)
        if (obje.parent_id === undefined)
            arr.push(obje.id)
    }
}

function dfs(sp,json_obj){
    visited=[]
    var json_all={valid_menus:"",invalid_menus:""}
    var valid=[]
    var invalid=[]

    for(var i=0;i<json_obj.length;i++)
        visited[i]=false
    stack_arr=[]
    for(var i=0;i<json_obj.length;i++)
    {
        if(!visited[i]){
            var tmp=json_obj[i].id
            console.log("tmp="+tmp)
            var path=[]
            var flag=true
            var json_output={root_id:"",children:""}
            stack_arr.push(json_obj[i].id)
            do{
                var curr=stack_arr.pop();
                var curr_right=curr-1;
                if(json_obj[tmp-1].child_ids.includes(curr))
                    console.log(json_obj[tmp-1].id)
                    json_output.root_id=json_obj[tmp-1].id
                if(visited[curr_right]==false){
                    console.log(json_obj[curr_right].id)
                    path.push(json_obj[curr_right].id)
                    visited[curr_right]=true;

                    for(var j=0;j<json_obj[curr_right].child_ids.length;j++)
                    {
                        if(visited[json_obj[curr_right].child_ids[j]-1]==false)
                            stack_arr.push(json_obj[curr_right].child_ids[j])
                        else
                            flag=false
                    }
                }
            }while (stack_arr.length>0)
            json_output.children=path

            console.log(json_output)
            if(flag)
                valid.push(json_output)
            else
                invalid.push(json_output)
            flag=true
        }
    }
    json_all.valid_menus=valid
    json_all.invalid_menus=invalid
    return json_all
}

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
