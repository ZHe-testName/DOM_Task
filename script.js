'use strict';

const autoCompelatList = document.getElementById('repos-list'),
    mainInput = document.getElementById('main-input');

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

function listCreator(array){
    const liArr = array.map(item => {
        const li = document.createElement('li');

        li.classList.add('founded-variant');
        li.append(item.name);

        return li;
    });

    return liArr;
};

async function getRepos(){
    const liForDeleating = autoCompelatList.querySelectorAll('.founded-variant');
    liForDeleating.forEach(li => li.remove());

    if (!mainInput.value) return;

    const response = await fetch(`https://api.github.com/search/repositories?q=${mainInput.value}&sort=stars&order=desc`);

    if(response.ok){
        const responseObj = await response.json();
        const reposArray = responseObj.items.slice(0, 5);


        
        autoCompelatList.append(...listCreator(reposArray));
    }else{
        throw new Error('HTTP Error : ' + response.status);
    }
};

const debouncedGetRepos = debounce(getRepos, 900);

mainInput.addEventListener('input', debouncedGetRepos);



// getRepos(); 

