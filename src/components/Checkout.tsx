import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
export const Checkout: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // Frete
    const [cep, setCep] = useState('');
    const [frete, setFrete] = useState<{valor:number, prazo:string}>({valor:0, prazo:''});

    // Função para simular frete
    const calcularFrete = (cepValue:string) => {
      let valor = 25;
      let prazo = '5 dias úteis';
      if (/^\d{5}-?\d{3}$/.test(cepValue)) {
        if (valorFinal >= 200) {
          valor = 0;
          prazo = '3 dias úteis';
        } else if (cepValue.startsWith('01')) {
          valor = 15;
          prazo = '2 dias úteis';
        }
      }
      setFrete({valor, prazo});
    };
  const { cart, total, clearCart } = useCart();
  const [success, setSuccess] = useState(false);
  const [pagamento, setPagamento] = useState<'pix'|'cartao'|''>('');
  const [parcelas, setParcelas] = useState(1);
  const [dadosCartao, setDadosCartao] = useState({nome:'', numero:'', validade:'', cvv:''});
  const [dadosPix, setDadosPix] = useState({cpf:'', nome:''});

  const descontoPix = pagamento === 'pix' ? 0.1 : 0;
  const valorFinal = (total * (1 - descontoPix)) + frete.valor;
  const valorParcela = pagamento === 'cartao' ? valorFinal / parcelas : valorFinal;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    clearCart();
    setTimeout(onClose, 3000);
  };

  if (success) {
    return (
      <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Compra finalizada!</h2>
        <p className="text-gray-700 mb-2">Obrigado por comprar na GilStore.</p>
        <span className="text-lg font-bold text-blue-700">Seu pedido está sendo processado.</span>
      </div>
    );
  }
  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Finalizar Compra</h2>
      <ul className="mb-4">
        {cart.map(item => (
          <li key={item.product.id} className="flex justify-between mb-2">
            <span>{item.product.title} x{item.quantity}</span>
            <span className="font-bold text-blue-700">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mb-2 text-right text-xl font-bold text-blue-700">Total: R$ {total.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
      {pagamento === 'pix' && (
        <div className="mb-2 text-right text-green-600 font-bold">Desconto Pix: -10% (R$ {(total*0.1).toLocaleString('pt-BR', {minimumFractionDigits:2})})</div>
      )}
      {frete.prazo && (
        <div className="mb-2 text-right text-green-700 font-bold">Frete: {frete.valor === 0 ? 'Grátis' : `R$ ${frete.valor.toLocaleString('pt-BR', {minimumFractionDigits:2})}`} | Prazo: {frete.prazo}</div>
      )}
      <div className="mb-4 text-right text-xl font-bold text-blue-900">Valor final: R$ {valorFinal.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
      {pagamento === 'cartao' && (
        <div className="mb-2 text-right text-blue-700 font-semibold">Parcelamento: {parcelas}x de R$ {valorParcela.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
      )}
      <form onSubmit={handleCheckout} className="flex flex-col gap-4 mt-4">
        <label className="font-bold text-gray-700">Simule o frete:</label>
        <div className="flex gap-2 items-center">
          <input type="text" placeholder="Digite seu CEP" value={cep} onChange={e=>setCep(e.target.value)} className="border rounded px-2 py-1 w-32" maxLength={9} />
          <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={()=>calcularFrete(cep)}>Calcular</button>
        </div>
        {frete.prazo && (
          <div className="text-green-700 font-bold">Frete: {frete.valor === 0 ? 'Grátis' : `R$ ${frete.valor.toLocaleString('pt-BR', {minimumFractionDigits:2})}`} | Prazo: {frete.prazo}</div>
        )}
        <label className="font-bold text-gray-700">Escolha a forma de pagamento:</label>
        <div className="flex gap-4">
          <button type="button" className={`px-4 py-2 rounded font-bold border ${pagamento==='pix'?'bg-green-100 border-green-500':'bg-gray-100 border-gray-300'}`} onClick={()=>setPagamento('pix')}>Pix (-10%)</button>
          <button type="button" className={`px-4 py-2 rounded font-bold border ${pagamento==='cartao'?'bg-blue-100 border-blue-500':'bg-gray-100 border-gray-300'}`} onClick={()=>setPagamento('cartao')}>Cartão de Crédito</button>
        </div>
        {pagamento==='cartao' && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Dados do Cartão</label>
            <input required type="text" placeholder="Nome no cartão" value={dadosCartao.nome} onChange={e=>setDadosCartao({...dadosCartao,nome:e.target.value})} className="border rounded px-2 py-1" />
            <input required type="text" placeholder="Número do cartão" value={dadosCartao.numero} onChange={e=>setDadosCartao({...dadosCartao,numero:e.target.value})} className="border rounded px-2 py-1" />
            <div className="flex gap-2">
              <input required type="text" placeholder="Validade" value={dadosCartao.validade} onChange={e=>setDadosCartao({...dadosCartao,validade:e.target.value})} className="border rounded px-2 py-1 w-1/2" />
              <input required type="text" placeholder="CVV" value={dadosCartao.cvv} onChange={e=>setDadosCartao({...dadosCartao,cvv:e.target.value})} className="border rounded px-2 py-1 w-1/2" />
            </div>
            <label className="font-semibold mt-2">Parcelas</label>
            <select value={parcelas} onChange={e=>setParcelas(Number(e.target.value))} className="border rounded px-2 py-1">
              {[...Array(12)].map((_,i)=>(<option key={i+1} value={i+1}>{i+1}x</option>))}
            </select>
          </div>
        )}
        {pagamento==='pix' && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Dados para pagamento via Pix</label>
            <input required type="text" placeholder="CPF" value={dadosPix.cpf} onChange={e=>setDadosPix({...dadosPix,cpf:e.target.value})} className="border rounded px-2 py-1" />
            <input required type="text" placeholder="Nome completo" value={dadosPix.nome} onChange={e=>setDadosPix({...dadosPix,nome:e.target.value})} className="border rounded px-2 py-1" />
          </div>
        )}
        {pagamento && (
          <button type="submit" className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-600 transition">Confirmar Compra</button>
        )}
      </form>
    </div>
  );
};