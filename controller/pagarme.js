// transacaoController = require('./transacao-controller');
// movimentacaoController = require('./movimentacao-controller');
// carrinhoController = require('./carrinho-controller');

exports.buildTransaction = (itens, cliente, cartao, res, req) => {
    if(!cliente){
        return res.status(400).json({ 'msg': 'Problemas na autenticação' });
    }

    if(!itens){
        return res.status(400).json({ 'msg': 'Você deve informar os itens' });
    }
    
    customer = {
        "external_id": cliente._id,
        "name": cliente.nome,
        "type": "individual",
        "country": "br",
        "email": cliente.email,
        "documents": [
            {
                "type": "cpf",
                "number": cliente.cpf
            }
        ],
        "phone_numbers": ["+55"+cliente.telefone.replace(/(\(|\)|\s|\-)/g,'')],
        "birthday": cliente.nascimento.toISOString().split('T')[0]
    };
    
    items = [];
    
    total = 0;
    
    itens = JSON.parse(JSON.stringify(itens));
    for(i in itens){
        items.push(
            {
                "id": itens[i]._id,
                "title": itens[i].nome,
                "unit_price": itens[i].preco*100,
                "quantity": itens[i].quantidade,
                "tangible": itens[i].fisico
            }
        );
        total+=itens[i].preco;
    }

    if(cartao){
        billing = {
            "name": cartao.nome,
            "address": {
                "country": "br",
                "state": cartao.estado,
                "city": cartao.cidade,
                "neighborhood": cartao.bairro,
                "street": cartao.rua,
                "street_number": cartao.numero,
                "zipcode": cartao.cep.replace('-','')
            }
        };

        data = {
            "payment_method": "credit_card",
            "amount": total*100,
            "card_number": cartao.numero,
            "card_cvv": cartao.cvv,
            "card_expiration_date": cartao.expiracao,
            "card_holder_name": cartao.nome,
            "customer": customer,
            "billing": billing,
            "items": items
        };
    }else{
        billing = {
            "name": cliente.nome,
            "address": {
                "country": "br",
                "state": cliente.estado,
                "city": cliente.cidade,
                "neighborhood": cliente.bairro,
                "street": cliente.rua,
                "street_number": cliente.numero,
                "zipcode": cliente.cep.replace('-','')
            }
        };

        data = {
            "payment_method": "boleto",
            "amount": total*100,
            "customer": customer,
            "billing": billing,
            "items": items
        };
    }

    exports.sendTransaction(data, res, req);
};

exports.sendTransaction = (transaction, res, req) => {
    pagarmeAPI.client.connect({ api_key: 'ak_test_vyhjh3rc3PbxslGWfg17PgRcdQAzOR' })
    .then(client => {
        client.transactions.create(transaction)
        .then(async data => {
            carrinhoController.findOne({cliente: req.user.id}, (err, carrinho) => {
                if(err) console.log(err);
                if(carrinho) {
                    carrinho.remove();
                }
            });
            
            var movimentacoes = [];
            for(i in data.items){
                data.items[i].unit_price/=100;
                movimentacoes.push({
                    produto: data.items[i].id,
                    transacao: trans_id,
                    quantidade: data.items[i].quantity,
                    data: Date.now(),
                    origem: 'compra',
                    valor: data.items[i].unit_price,
                    confirmado: data.payment_method == 'credit_card'
                });
            }

            var transacao = {
                total: data.amount/100,
                items: data.items,
                cliente: req.user.id,
                metodo: data.payment_method,
                status: data.status,
                tid: data.tid,
                referencia: null,
                plataforma: 'pagarme',
                cupom: null,
                desconto: 0,
                boleto: data.boleto_url
            };
            var trans_id = await transacaoController.save(transacao, res);
            if(trans_id){
                for(i in movimentacoes){
                    movimentacaoController.save(movimentacoes[i]);
                }
                res.status(201).json(transacao);
            }else{
                res.status(400).json(transacao);
            }
        })
        .catch(e => {
            if(e.response){
                console.log(e.response.errors);
            }else{
                console.log(e);
            }
            res.json({});
        });
    })
    .then(transactions => console.log(transactions))
    .catch(error => console.log(error))
}

exports.createCard = (card) => {
    return new Promise(resolve => {
        pagarmeAPI.client.connect({api_key: 'ak_test_vyhjh3rc3PbxslGWfg17PgRcdQAzOR'})
        .then(client => {
            client.cards.create(card)
            .then(data => {
                resolve(data);
            })
            .catch(e => {
                if(e.response){
                    resolve(e.response.errors);
                }else{
                    resolve(e);
                }
            })
        });
    });
};

exports.createCustomer = (customer) => {
    return new Promise(resolve => {
        pagarmeAPI.client.connect({api_key: 'ak_test_vyhjh3rc3PbxslGWfg17PgRcdQAzOR'})
        .then(client => {
            client.customers.create(customer)
            .then(data => {
                resolve(data);
            })
            .catch(e => {
                if(e.response){
                    resolve(e.response.errors);
                }else{
                    resolve(e);
                }
            });
        });
    })
};