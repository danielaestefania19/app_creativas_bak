App = {
    web3: null,
    contracts: {},
    network_id:5,
    url:'https://goerli.infura.io/v3/3fd7c8337c8142f8b3c6b0c0dfa1c565',
    supervisor:'0x1D3bF2Bf979dE2BC9D2D00CC6246ad8Bc55ae292',
    current_account:'',
    value:1000000000000000000,
    index:0,
    margin:10,
    left:15,
    init: function() {
      return App.initWeb3();
    },
    //var Web3 = require('web3');
    initWeb3: function() {
      if (typeof web3 !== 'undefined') {
        App.web3 = new Web3(Web3.givenProvider);
      } else {
        App.web3 = new Web3(App.url);
      }
      ethereum.enable();
      return App.initContract();

    },

    initContract: function() {

      $.getJSON('../RES4.json', function(data) {
        App.contracts.RealEstate = new App.web3.eth.Contract(data.abi, data.networks[App.network_id].address, {});
        //App.contracts.RealEstate = web3.eth.contract(data.abi, "0xE8ED711B8983e180Da2cC1C8B782fdD196B5df8E");
        App.current_account=web3.eth.defaultAccount;
        App.contracts.RealEstate.methods.supervisor()
        .call()
        .then((r)=>{

          App.supervisor=r;
        })
        App.contracts.RealEstate.methods.balanceOf()
        .call({from:App.current_account})
        .then((receipt)=>{
          jQuery('#balance').html(" Número de token que posee la cuenta actual: "+ receipt)
          // console.log(receipt);
        })

        App.fetchAllAssets();

      })

      return App.bindEvents();
    },

    bindEvents: function() {
      $(document).on('click', '#add_asset', function(){
        App.addAsset(jQuery('#asset_price').val(),jQuery('#asset_autor').val(),jQuery('#asset_titulo').val(),jQuery('#asset_fecha').val(),jQuery('#asset_frac').val(),jQuery('#asset_tokenURI').val(),jQuery('#asset_tokenURI1').val(),jQuery('#asset_owner').val());
      });
      $(document).on('click', '#approve_asset', function(){
        App.ApproveAsset(jQuery('#asset_id').val(),jQuery('#to_address').val());
     });

     $(document).on('click', '#transfer_asset', function(){
      App.TransferAsset(jQuery('#from_address').val(),jQuery('#transfer_asset_id').val());
     });

      $(document).on('click', '#build_asset', function(){
        App.BuildAsset(jQuery('#build_asset_id').val(),jQuery('#build_asset_value').val());
      });

      $(document).on('click', '#clear_approval', function(){
        App.ClearApproval(jQuery('#asset_id').val(),jQuery('#to_address').val());
      });

      $(document).on('click', '#appreciate_asset', function(){
        App.Appreciate(jQuery('#assess_asset_id').val(),jQuery('#assess_value').val());
      });

      $(document).on('click', '#depreciate_asset', function(){
        App.Depreciate(jQuery('#assess_asset_id').val(),jQuery('#assess_value').val());
      });
      $(document).on('click', '#balance_of', function(){
        App.balanceOf();
      });

      App.populateAddress();
    },

    populateAddress : function(){
      App.current_account=web3.eth.defaultAccount;
        var option='<option></option>';
        new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
          for(var i=0;i<accounts.length;i++){
            option+='<option>'+accounts[i]+'</option>';
          }
          jQuery('#asset_owner').append(option);
          jQuery('#to_address').append(option);
          jQuery('#from_address').append(option);
          // jQuery('#transfer_to_address').append(option);
        });

    },
    balanceOf:function(){
      App.contracts.RealEstate.methods.balanceOf()
        .call({from:App.current_account})
        .then((receipt)=>{
          jQuery('#balance').html("  "+ receipt)
          // console.log(receipt);
        })
    } ,

    addAsset:function(price,autor,titulo,fecha,frac,tokenCDI,tokenCDI1,owner){
      if(price==='' || owner===''){
        alert('Please enter all values');
        return false;
      }

      var option={from:App.supervisor}
      App.contracts.RealEstate.methods.addAsset(price,autor,titulo,fecha,frac,tokenCDI,tokenCDI1,owner)
      .send(option).on('transactionHash', function(hash){
      console.log(hash);
      location.reload()
      App.fetchAllAssets();
    }).on('error',(e)=>{
      console.log('error')
    })
    },

    fetchAllAssets:function(){
      App.contracts.RealEstate.methods.assetsCount().call().then((length)=>{
        console.log()
        for(var i=0;i<length;i++){
          App.contracts.RealEstate.methods.assetMap(i)
          .call()
          .then((r)=>{
            App.contracts.RealEstate.methods.ownerOf(r.assetId).call().then((result)=>{
              App.contracts.RealEstate.methods.assetApprovals(r.assetId).call().then((res)=>{
                if(res==0){
                  res='None'
                }
                if (r.assetId >=5){
                var card='<div class="col-lg-4"><div class="card" style="color:black;">'+
                '<img class="card-img-top" src="https://ipfs.io/ipfs/'+r.tokenCDI+'" alt="Card image"></img>'+
                '<div class="card-body">'+
                '<h6 class="card-title">Obra/Pza # '+r.assetId+'</p>'+
                '<p class="card-title">Autor '+r.autor+'</p>'+
                '<p class="card-title">Titulo '+r.titulo+'</p>'+
                '<p class="card-title">Fecha '+r.fecha+'</p>'+
                '<p class="card-text">Precio: '+r.price+' ETH </p>'+
                '<p class="card-text">Fracciones: '+r.frac+' </p></div>'+
                '<a href="https://gateway.pinata.cloud/ipfs/'+r.tokenCDI1+'" class="btn btn-primary stretched-link">Ampliar</a>'+
                '<div class="card-footer">'+'<small><b>Propietario:</b> '+result+'<br><b>Aprobado:</b> '+res+'</small></div></div></div>';
                  $('#assets').append(card);
                }
                })
              })
          })
        }

      })
    },

    ApproveAsset:function(id,to_address){
      var option={from:App.current_account};
      App.contracts.RealEstate.methods.approve(to_address,parseInt(id))
      .send(option)
      .on('receipt',(r)=>{
      })
      .on('transactionHash',(hash)=>{
        location.reload()
        App.fetchAllAssets();

      }).on('error',(e)=>{
        console.log(e)
      })
    },
    TransferAsset:function(fromAddress,assetId){
      App.contracts.RealEstate.methods.assetMap(assetId)
      .call()
      .then((r)=>{
        console.log(r);
        var option={from:App.current_account,value:web3.toWei(parseInt(r.price), "ether")};
        assetId=parseInt(assetId);
        App.contracts.RealEstate.methods.transferFrom(fromAddress,assetId)
        .send(option)
        .on('receipt',(rec)=>{
          console.log(rec)
        })
        .on('transactionHash',(hash)=>{
          location.reload()
          App.fetchAllAssets();
          
        }).on('error',(e)=>{
          console.log(e)
        })
      })

    },
    BuildAsset:function(assetId,value){
      App.contracts.RealEstate.methods.build(parseInt(assetId),parseInt(value))
      .send({from:App.current_account,value:web3.toWei(parseInt(value), "ether")})
      .on('receipt',(r)=>{
        location.reload()
        App.fetchAllAssets();
        
      })
    } ,
 
  ClearApproval:function(id,to_address){

    var option={from:App.current_account};  
    id=parseInt(id);   
    App.contracts.RealEstate.methods.clearApproval(id,to_address)
    .send(option)
    .on('transactionHash',(hash)=>{
      
      location.reload()
      App.fetchAllAssets();
    }).on('error',(e)=>{
      console.log(e)
    })
},
Appreciate:function(assetId,appreciationValue){
  App.contracts.RealEstate.methods.appreciate(parseInt(assetId),parseInt(appreciationValue))
  .send({from:App.supervisor})
  .on('receipt',(r)=>{
    location.reload()
    App.fetchAllAssets();
    
  })
} ,
Depreciate:function(assetId,depreciationValue){
  App.contracts.RealEstate.methods.depreciate(parseInt(assetId),parseInt(depreciationValue))
  .send({from:App.supervisor})
  .on('receipt',(r)=>{
    location.reload()
    App.fetchAllAssets();
    
  })
} 
}
  $(function() {
    $(window).load(function() {
      App.init();
      toastr.options = {
        // toastr.options = {
          "closeButton": true,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-full-width",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        // }
      };
    });
  });
  
