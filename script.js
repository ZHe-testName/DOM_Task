'use strict';

const autoCompelatList = document.getElementById('repos-list'),
    mainInput = document.getElementById('main-input'),
    checkedList = document.getElementById('checked');

let reposArray;

const debounce = (fn, debounceTime) => {
    let timeout;
  
    return function(){
      const functionCall = () => {
        fn.apply(this, arguments);
      };
  
      clearTimeout(timeout);
  
      timeout = setTimeout(functionCall, debounceTime);
    }
};

function deleteElemsByClass(classSelector){
    const liForDeleating = autoCompelatList.querySelectorAll(classSelector);
    liForDeleating.forEach(li => li.remove());
};


function listCreator(array){
    const liArr = array.map(item => {
        const li = document.createElement('li');

        li.classList.add('founded-variant');
        li.append(item.name);

        return li;
    });

    return liArr;
};

function chekedListCreator(event){
    const target = event.target;

    reposArray.forEach(item => {
        if(target.outerText === item.name){
            const li = document.createElement('li');
            li.classList.add('repo');

            li.innerHTML = `<span class="text">Name: ${item.name}</span>
                            <span class="text">Owner: ${item.owner.login}</span>
                            <span class="text">Stars: ${item.stargazers_count}  &#10032</span>
                        
                            <button class="close-button"></button>`;

            checkedList.append(li);
        }
    });

    deleteElemsByClass('.founded-variant');
};

async function responseRenderer(response){
    if(response.ok){
        const responseObj = await response.json();
        const reposArray = responseObj.items.slice(0, 5);


        
        autoCompelatList.append(...listCreator(reposArray));

        return reposArray;
    }else{
        throw new Error('HTTP Error : ' + response.status);
    }
};

async function reposHandler(){
    deleteElemsByClass('.founded-variant');

    if (!mainInput.value) return;

    const response = await fetch(`https://api.github.com/search/repositories?q=${mainInput.value}&sort=stars&order=desc`);

    reposArray = await responseRenderer(response);
};

const debouncedReposHandler = debounce(reposHandler, 900);

mainInput.addEventListener('input', debouncedReposHandler);
autoCompelatList.addEventListener('click', chekedListCreator);


