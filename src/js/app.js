App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originArtistID: "0x0000000000000000000000000000000000000000",
    originArtistName: null,
    albumTitle: null,
    albumTracks: null,
    albumStyle: null,
    albumNotes: null,
    albumPrice: 0,
    labelID: "0x0000000000000000000000000000000000000000",
    labelName: null,
    labelInformation: null,
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originArtistID = $("#originArtistID").val();
        App.originArtistName = $("#originArtistName").val();
        App.albumTitle = $("#albumTitle").val();
        App.albumTracks = $("#albumTracks").val();
        App.albumStyle = $("#albumStyle").val();
        App.albumNotes = $("#albumNotes").val();
        App.albumPrice = $("#albumPrice").val();
        App.labelID = $("#labelID").val();
        App.labelName = $("#labelName").val();
        App.labelInformation = $("#labelInformation").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originArtistID, 
            App.originArtistName,
            App.albumTitle,
            App.albumTracks,
            App.albumStyle,
            App.albumNotes, 
            App.albumPrice, 
            App.labelID, 
            App.labelName,
            App.labelInformation,
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.meetLabel(event);
                break;
            case 2:
                return await App.signContract(event);
                break;
            case 3:
                return await App.recordAlbum(event);
                break;
            case 4:
                return await App.mixAlbum(event);
                break;
            case 5:
                return await App.sellAlbum(event);
                break;
            case 6:
                return await App.buyAlbum(event);
                break;
            case 7:
                return await App.fetchItemBufferOne(event);
                break;
            case 8:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    meetLabel: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.meetLabel(
                App.upc, 
                App.metamaskAccountID, 
                App.originArtistName,
                App.albumTitle,
                App.albumTracks,
                App.albumStyle,
                App.albumNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('meetLabel',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    signContract: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.signContract(
                App.upc, 
                App.labelID,
                App.labelName,
                App.labelInformation,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('signContract',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    recordAlbum: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.recordAlbum(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('recordAlbum',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    mixAlbum: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.mixAlbum(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('mixAlbum',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    sellAlbum: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const albumPrice = web3.toWei(0.01, "ether");
            console.log('albumPrice',albumPrice);
            return instance.sellAlbum(App.upc, albumPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellAlbum',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyAlbum: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(0.02, "ether");
            return instance.buyAlbum(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyAlbum',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
