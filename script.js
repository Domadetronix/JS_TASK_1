class View{
    constructor(){
        this.container = document.querySelector('.container')
        this.searchBlock = this.createEl('div', 'search-block')
        this.searchInput = this.createEl('input', 'search-input')
        this.searchBlock.append(this.searchInput)
        this.searchResults = this.createEl('ul', 'search-results')
        this.searchBlock.append(this.searchResults)

        this.resultBlock = this.createEl('div', 'result-block')
        
        this.container.append(this.searchBlock);
        this.container.append(this.resultBlock)
    }
    createEl(elTag, elClass){
        const el = document.createElement(elTag);
        if (elClass){
            el.classList.add(elClass)
        }
        console.log(el)
        return el
    }

    createRepo(repoData){
        const repoElement = this.createEl('li', 'repo-preview')
        repoElement.textContent = repoData.name
        this.searchResults.append(repoElement)
    }
}

class Search{
    constructor(view){
        this.view = view;
        this.view.searchInput.addEventListener('input', this.debounce(this.searchRepos.bind(this), 500))
    }

    debounce = (fn, debounceTime) => {
        let timeout;
        return function(){
            const fnCall = () => { fn.apply(this, arguments) }
            clearTimeout(timeout);
            timeout = setTimeout(fnCall, debounceTime)            
        }
    }

    cleanSR = () => {
        document.querySelectorAll('.repo-preview').forEach(elem => elem.remove())
    }

    addRepoToList(repo){

    }

    async searchRepos(event){
        this.cleanSR();
        if (!event.target.value) return
        return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=5`).then(res => {
            if (res.ok){
                res.json().then(res => {
                    res.items.forEach(repo => this.view.createRepo(repo))
            })
            }
        }) 
    }
}


new Search(new View)