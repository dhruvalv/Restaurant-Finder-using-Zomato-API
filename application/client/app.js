// Banner Component
const bannerComponent = {
    template: `<div class="col-lg">
                     <h1 class="display-2">{{appname}}</h1>
                     <p class="lead">Restaurant Finder</p>
                </div>`,
    props: ['appname']
}

// Details of the restaurant.
const resultComponent = {
    template: `<div>
                <center>
                    <img v-bind:src='details.photos_url' width="20%" height="20%">  
                    <h4>{{details.restroname}}</h4>
                </center><br>
                <div id="formatresult">
                    <p>Address : {{details.restroaddress}}</p>
                    <p>Cuisines: {{details.cuisine}}</p>
                    <p>Ratings: {{details.rating}}. ({{details.restrorating}}/5 based on {{details.restrovotes}} votes)</p>
                    <a v-bind:href='details.menu_url' target="_blank" style='color:#ffffff'>Menu</a>
                </div>
                </div>`,
    props: ['details']
}

const socket = io()
const zomato = new Vue({
    el: '#zomato',
    data: {
        appname: 'Zomato',
        searchedRestro:'',
        searchHistory: [],
        restaurants: [],
        selectedRestro:{},  
        isLoading: false,
        isFound: false,
        isEmpty: false,
        isDisplay: false,      
        details : {"restroname":""}
    },
    methods: {
        searchRestro: function () {
            if(this.searchedRestro.trim()){
                const vm = this
                this.isLoading = true
                axios.get(`/api/search?q=${this.searchedRestro}`)
                .then(response => {
                    if(response == null || response.data.restaurants.length==0){
                        vm.isFound = true;                            
                    }else{
                        hist = {"data":this.searchedRestro,"at": new Date().toLocaleString()};
                        socket.emit('history-added', hist)
                        vm.isLoading = false                  
                        vm.restaurants=response.data.restaurants
                    }
                })
            }else{    
                this.isEmpty = true;
            }
        },
        restroDetails: function (id) {
            const vm = this
            this.isLoading = true
            this.isDisplay = true
            axios.post(`/api/details`, {
                id
            })
            .then(response => {
                vm.isLoading=false
                vm.details.restroname = response.data.name;
                vm.details.restroaddress = response.data.location.address;
                vm.details.cuisine = response.data.cuisines?response.data.cuisines:'Deli';
                vm.details.rating = response.data.user_rating.rating_text;
                vm.details.restrorating = response.data.user_rating.aggregate_rating;
                vm.details.restrovotes = response.data.user_rating.votes;
                vm.details.menu_url = response.data.menu_url;
                if(response.data.thumb!=='')  
                    vm.details.photos_url = response.data.thumb;
                else
                    vm.details.photos_url = 'https://smedia2.intoday.in/btmt/images/stories/zomato-fact-sheet_660_052417055850_111517063712.jpg';
            })
        },
        showFromHistory: function (item) {
            this.searchAgain(true);
            this.searchedRestro = item.data;
            this.searchRestro();
         },
        searchAgain: function (flag) {
            this.isDisplay= false
            this.isFound = false;
            this.isEmpty = false;
            this.isLoading = flag;
            this.restaurants=[]
            this.searchedRestro=''
        },
        removeisFoundMsg: function () {
            this.isFound = false;
            this.isEmpty = false;
            this.isLoading = false;
            this.restaurants=[]
        },
        clearhistory: function () {
            this.searchHistory = [];
            socket.emit('clearHistory')
        }
    },
    components: {
        'banner-component': bannerComponent,
        'result-component': resultComponent
    }
})

socket.on('newhistorylist', (historyList) => {
    zomato.searchHistory = historyList.reverse();
})

