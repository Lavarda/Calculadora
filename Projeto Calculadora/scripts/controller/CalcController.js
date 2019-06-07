// Inicializando a classe de controle da calculadora.

class CalcController{

    // È chamado automaticamente quando a classe é instanciada em outro script.

    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOnOf = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = []; 
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate = new Date();
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    // Inicialização dos metodos que iram mostrar na tela o date,time e o display.

    pasteFromClipboard(){

        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('text');
            this.displayCalc = parseFloat(text);
        });
    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    initialize(){

        this.setDisplayDateTime();

        // Criação de um intervalo para mudar os segundos na tela a cada 1000 milisegundos.

        setInterval( () => {

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn =>{

            btn.addEventListener('dblclick', e=>{

                this.toogleAudio();

            });

        });
    }
    
    toogleAudio(){

        this._audioOnOf = !this._audioOnOf;

    }

    playAudio(){

        if(this._audioOnOf){

            this._audio.currentTime = 0;
            this._audio.play();

        }
    }

    initKeyboard(){

        document.addEventListener('keyup', e=> {

            this.playAudio();
            
            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
                
                case '+':
                case '-':
                case '/':   
                case '*':
                case '%':
                    this.addOperation('e.key');
                    break;
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case 'ponto':
                case ',':
                    this.addDot('.');
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
    }

    addEventListenerAll(elements, events , fn){

        // Cria um laço para adicionar eventos no botão, como clicar e arrastar.

        events.split(' ').forEach(event => {

            elements.addEventListener(event, fn, false);

        });

    }

    clearAll(){

        // Limpar todos os valores digitados.

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    clearEntry(){

        // Limpar o último valor digitado.

        this._operation.pop();

        this.setLastNumberToDisplay();
    }

    getLastOperation(){

        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){

        // Descobrir se o ultimo valor digitado é um operador com indexOf.

       return ( ['+','-','*','%','/'].indexOf(value) > -1 );
    }

    pushOperation(value){

        // Adicionar o operador e fazer com que ele já faça a operação em pares.

        this._operation.push(value);

        if( this._operation.length > 3 ){

            this.calc();
        }
    }

    getResult(){
        try{

            return eval(this._operation.join("") );;

        }catch(e){

            setTimeout(()=>{

                this.setError();

            }, 0.1);
        }
    
    }

    calc(){

        // Metodo pra calcular a operação em pares.

        let last = '';

        this._lastOperator = this.getLastItem();

        if ( this._operation.length < 3 ){

            // Salvando os valores para quando clicar o = igual o eval não apagar os dados.

            let firstItem = this._operation[0];

            this._operation = [firstItem , this._lastOperator, this._lastNumber];
        }

        if ( this._operation.length > 3){

            // Mostra caso for digita um sinal no ultimo digito repete ele clicando 2 vezes no igual.

            last = this._operation.pop();

            this._lastNumber = this.getResult();

        }else if ( this._operation.length == 3){

            // Repete o ultimo valor digitado clicando 2 vezes no igual com a ultima operação 2+3 = 5 = 8...

            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if ( last == '%'){

            result /= 100;

            this._operation = [result];

        }else {

            this._operation = [result];

            if (last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    getLastItem( isOperator = true){

        // Verificar se o último item é um operador se for manter ele no array e utilizar no duplo igual.

        let lastItem;

        for ( let i = (this._operation.length -1) ; i >= 0 ; i-- ){

            if( this.isOperator(this._operation[i]) == isOperator ){

                lastItem = this._operation[i];

                break;
            } 
        }

        if (!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this.lastNumber;
        }

        return lastItem;

    }

    setLastNumberToDisplay(){

        // Mostrar o ultimo número digitado na tela.

        let lastNumber = this.getLastItem(false);


        if (!lastNumber){

             lastNumber = 0;

        }

        this.displayCalc = lastNumber;
    }

    addOperation(value){

        // Verificação para ver se é um valor númerico ou não e adicionar o valor ao array.

        if( isNaN ( this.getLastOperation() ) ){

            // Um valor de uma String.

            if ( this.isOperator(value) ){

                // Trocar o operador.

                this.setLastOperation(value);

            }else{

                this.pushOperation(value);

                // Atualizar o display :

                this.setLastNumberToDisplay();
            }

        } else {

            // Valor númerico ou operador.

            if(this.isOperator(value)){

                this.pushOperation(value);

            }else {

                let newValue = this.getLastOperation().toString() + value.toString();

                this.setLastOperation(( newValue ) );

                // Atualizar o display.

                this.setLastNumberToDisplay();

            }

        }

    }

    setError(){

        // Função de erro quando escreve ou aperta algum botão não definido.

        this.displayCalc = "Error";
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if( typeof lastOperation=== 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

        console.log("getLastItem", lastOperation)
    }

    execBtn(value){

        // Switch declarado para fazer uma função a cada botão que for apertado.

        this.playAudio();

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;
            
            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':

                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }
    }

    initButtonsEvents(){

        // Criação dos eventos ao clicar nos botões da calculadora.

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        // Um laço para conseguir percorer todos os botões e motrar qual botão que é pelo index.

        buttons.forEach( (btn, index) => {

            // Adiciona evento a todos os botões.

            this.addEventListenerAll(btn, 'click drag ', e => {

               let textBtn = btn.className.baseVal.replace("btn-", "");

               this.execBtn(textBtn);

            });

            // Muda o cursor do mouse para uma mão assim que ele passar o mouse por cima.

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {

                btn.style.cursor = "pointer";
            })

        })
    }

    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this.locale,{

            // Personalizando a data para mostrar em extenso. 

            day: "2-digit",
            month : "long",
            year : "numeric"

        });

        this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
    }

    // Iniciando os getters e setters da classe.

    get displayTime(){

        return this._timeEl.innerHTML;
    }

    set displayTime(value){

        this._timeEl.innerHTML = value;
    }

    get displayDate(){

        return this._dateEl.innerHTML;
    }

    set displayDate(value){

        this._dateEl.innerHTML = value;
    }

    get displayCalc(){

        return this._displayCalcEl.innerHTML; 
    }

    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value; 
    }

    get currentDate(){
  
        return new Date(); 
    }

    set currentDate(value){

        this._currentDate = value; 
    }

}