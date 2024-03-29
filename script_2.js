const container = document.querySelector('.container')
const searchBlock = createEl('div', 'search-block')

const searchInput = createEl('input', 'search-input')
searchInput.addEventListener('input', debounce(searchRepos, 500))     // слушатель поисковой строки
searchBlock.append(searchInput)

searchResults = createEl('ul', 'search-results')
searchBlock.append(searchResults)

const resultBlock = createEl('div', 'result-block')
resultBlock.addEventListener('click', (event) => {
    if (event.target.tagName === "BUTTON"){
        const id = event.target.getAttribute('id').split('-')[0]
        deleteById(id);
    }
})

container.append(searchBlock);
container.append(resultBlock)


function createEl(elTag, elClass){
    const el = document.createElement(elTag);
    if (elClass){
        el.classList.add(elClass)
    }
    return el
}

function createRepo(repoData, onRepoClick){
    const repoPreview = createEl('li', 'repo-preview')
    repoPreview.addEventListener('click', () => {    //слушатель на результаты поиска
        addRepoToList(repoData)
        onRepoClick()
    })
    repoPreview.textContent = repoData.name
    searchResults.append(repoPreview)
}

    
function addRepoToList(repoInfo){
    const repo = createEl('div', 'repo-element')
    repo.setAttribute('id', repoInfo.id)

    const repoInfoBlock = createEl('div', 'repo-info')
    const repoName = createEl('div', 'repo-info_item')
    repoName.textContent = `Name: ${repoInfo.name}`
    const repoOwner = createEl('div', 'repo-info_item')
    repoOwner.textContent = `Owner: ${repoInfo.owner.login}`
    const repoRang = createEl('div', 'repo-info_item')
    repoRang.textContent = `Stars: ${repoInfo.stargazers_count}`
    const closeBut = createEl('button', 'close-button')
    closeBut.setAttribute('id', `${repoInfo.id}-close`)

    repoInfoBlock.append(repoName, repoOwner, repoRang)
    repo.append(repoInfoBlock, closeBut)
    resultBlock.prepend(repo)
}
  
cleanSR = () => {
    document.querySelectorAll('.repo-preview').forEach(elem => elem.remove())
}

async function searchRepos(event){
    cleanSR();
    if (!event.target.value) return
    return await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}&per_page=5`).then(res => {
        if (res.ok){
            res.json().then(res => {
                res.items.forEach(repo => createRepo(repo, ()=>{
                    event.target.value = ''
                    cleanSR();
                }))
            })
        }
    }) 
}

function deleteById(id){
    item = document.getElementById(id);
    item.remove();
}


function debounce(fn, debounceTime) {
    let timeout;
    return function(){
        const fnCall = () => { fn.apply(this, arguments) }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, debounceTime)            
    }
}


