window.addEventListener('DOMContentLoaded', function(){

    //load json file from github server
    var prm=[];
    var json_data, repo_data;
    prm[0] = new Promise(function(resolver){ //load data.json to "json_data"
        var xhr = new XMLHttpRequest();
        xhr.open('get',"https://raw.githubusercontent.com/rikuto-dev/profile/main/data.json");
        xhr.onload=function(){
            json_data = JSON.parse(this.responseText);
            resolver(this);
        };
        xhr.send();
    });
    prm[1] = new Promise(function(resolver){ //load data about repositories to "repo_data"
        var xhr = new XMLHttpRequest();
        xhr.open('get', "https://api.github.com/users/rikuto-dev/repos");
        xhr.onload=function(e){
            repo_data = JSON.parse(this.responseText);
            resolver(this);
        };
        xhr.send();
    });

    //extract obective data from "repo_data" to 3 lists
    Promise.all(prm).then(function(){
        let recommendList = [[null, null], [null, null], [null, null]];
        let popularList = [[null, null], [null, null], [null, null]];
        let updatedList = [[null, null], [null, null], [null, null]];
        for(let component of repo_data){
            date = new Date(component.pushed_at);
            for(let target = 0; target < 3; target++){
                if(json_data.recommend[target] == component.id){
                    recommendList[target] = [date, component.html_url, component.name, component.description, component.language];
                }
            }
            for(let target = 0; target < 3; target++){
                if(date > updatedList[target][0] || updatedList[target][0] == null){
                    updatedList.splice(target, 0, [date, component.html_url, component.name, component.description, component.language]);
                    updatedList.splice(-1, 1);
                    break;
                };
            };
            for(let target = 0; target < 3; target++){
                if(component.stargazers_count > popularList[target][0] || popularList[target][0] == null){
                    popularList.splice(target, 0, [component.stargazers_count, component.html_url, component.name, component.description, component.language]);
                    popularList.splice(-1, 1);
                    break;
                };
            };
        };

        //define variables
        const recommend = document.getElementById('recommend-repo');
        const popular = document.getElementById('popular-repo');
        const updated = document.getElementById('updated-repo');
        recommend.insertAdjacentHTML('beforeend', '<h2>Recommended repositories</h2><ol><li><div class=\"repo-title\"><a href=\"' + recommendList[0][1] + '\">' + recommendList[0][2] + '</a></div><div class=\"repo-desc\">' + recommendList[0][3] + '</div><div class=\"repo-lang\"><span style=\"background-color: ' + json_data.color[recommendList[0][4]] + ';\"></span>' + recommendList[0][4] + '</div></li><li><div class=\"repo-title\"><a href=\"' + recommendList[1][1] + '\">' + recommendList[1][2] + '</a></div><div class=\"repo-desc\">' + recommendList[1][3] + '</div><div class=\"repo-lang\"><span style=\"background-color: ' + json_data.color[recommendList[1][4]] + ';\"></span>' + recommendList[1][4] + '</div></li><li><div class=\"repo-title\"><a href=\"' + recommendList[2][1] + '\">' + recommendList[2][2] + '</a></div><div class=\"repo-desc\">' + recommendList[2][3] + '</div><div class=\"repo-lang\"><span style=\"background-color: ' + json_data.color[recommendList[2][4]] + ';\"></span>' + recommendList[2][4] + '</div></li></ol>');
        popular.insertAdjacentHTML('beforeend', '<h2>Popular repositories</h2><ol><li><div class=\"repo-title\"><a href=\"' + popularList[0][1] + '\">' + popularList[0][2] + '</a></div><div class=\"repo-desc\">' + popularList[0][3] + '</div><div class=\"repo-lang\"><span style=\"background-color: ' + json_data.color[popularList[0][4]] + ';\"></span>' + popularList[0][4] + '</div></li><li><div class=\"repo-title\"><a href=\"' + popularList[1][1] + '\">' + popularList[1][2] + '</a></div><div class=\"repo-desc\">' + popularList[1][3] + '</div><div class=\"repo-lang\"><span style=\"background-color: ' + json_data.color[popularList[1][4]] + ';\"></span>' + popularList[1][4] + '</div></li><li><div class=\"repo-title\"><a href=\"' + popularList[2][1] + '\">' + popularList[2][2] + '</a></div><div class=\"repo-desc\">' + popularList[2][3] + '</div><div class=\"repo-lang\"><span style=\"background-color: ' + json_data.color[popularList[2][4]] + ';\"></span>' + popularList[2][4] + '</div></li></ol>');
        updated.insertAdjacentHTML('beforeend', '<h2>Updated repositories</h2><ol><li><div class=\"repo-title\"><a href=\"' + updatedList[0][1] + '\">' + updatedList[0][2] + '</a></div><div class=\"repo-desc\">' + updatedList[0][3] + '</div><div class=\"repo-lang\"><span style=\"background-color: ' + json_data.color[updatedList[0][4]] + ';\"></span>' + updatedList[0][4] + '</div></li><li><div class=\"repo-title\"><a href=\"' + updatedList[1][1] + '\">' + updatedList[1][2] + '</a></div><div class=\"repo-desc\">' + updatedList[1][3] + '</div><div class=\"repo-lang\"><span style=\"background-color: ' + json_data.color[updatedList[1][4]] + ';\"></span>' + updatedList[1][4] + '</div></li><li><div class=\"repo-title\"><a href=\"' + updatedList[2][1] + '\">' + updatedList[2][2] + '</a></div><div class=\"repo-desc\">' + updatedList[2][3] + '</div><div class=\"repo-lang\"><span style=\"background-color: ' + json_data.color[updatedList[2][4]] + ';\"></span>' + updatedList[2][4] + '</div></li></ol>');
        const parent = document.querySelector('#timeline div');
        let filter = document.querySelectorAll('input[type="radio"]');
        let icon = '';
        let days = 10;

        //define function
        function sortTimeline(value){
            while(parent.firstChild){
                parent.removeChild(parent.firstChild);
            }
            year = '';
            date = '';
            let index = 0
            for(let component of json_data.timeline){
                if(value == 'all' || value == component.category){
                    component.category == "releases" ? icon = 'images/png/partying_face_3d.png' : component.category == "notes" ? icon = 'images/png/memo_3d.png' : icon = '';
                    if(component.date.slice(0, 4) != year){
                        year = component.date.slice(0, 4);
                        parent.insertAdjacentHTML('beforeend', '<section id=\"year-' + year + '\"><h2>' + year + '</h2><ul></ul></section>');
                        child = document.querySelector('#timeline #year-' + year + ' ul');
                    };
                    if(date != component.date.slice(5, 10)){
                        index += 1;
                        if(index > days){
                            break;
                        }
                        child.insertAdjacentHTML('beforeend', '<li><div class=\"dot\"></div><div class=\"log\"><div class=\"date\"><time>' + component.date + '</time></div><div class=\"bubble\">' + (icon != "" ? '<div class=\"icon\"><img src=\"' + icon + '\" width="22px"></div>' : '') + component.content + '</div></div></li>');
                    }else{
                        child.insertAdjacentHTML('beforeend', '<li><div class=\"log\"><div class=\"bubble\">' + (icon != "" ? '<div class=\"icon\"><img src=\"' + icon + '\" width="22px"></div>' : '') + component.content + '</div></div></li>');
                    }
                    date = component.date.slice(5, 10);
                };
            };
        };

        //operate filter
        sortTimeline('all')
        for(let target of filter){
            target.addEventListener('change', function (){
                console.log(target.value);
                if(target.value == 'recommend' || target.value == 'popular' || target.value == 'updated'){
                    recommend.style.display = popular.style.display = updated.style.display = "none";
                    target.value == 'recommend' ? recommend.style.display = "block" : target.value == 'popular' ? popular.style.display = "block" : updated.style.display = "block";
                }else{
                    sortTimeline(target.value)
                }
            });
        };
        for(let clicked of document.querySelectorAll('input[type="button"]')){
            clicked.addEventListener('change', function (){
                console.log("clicked!!");
                // days += 1;
            });
        };
    });
});