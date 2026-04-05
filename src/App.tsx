/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Check, 
  ChevronRight, 
  ShoppingBag, 
  Truck, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  CreditCard, 
  Smartphone, 
  Package, 
  Star,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
type BrandType = 'OUR_BRAND' | 'MY_BRAND';
type PaymentMethod = 'PIX' | 'CARD';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image?: string;
}

interface OrderData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  cep: string;
  brandName: string;
}

const MAIN_KIT_PRICE = 159.90;
const ORDER_NUMBER = "1437";
const WHATSAPP_NUMBER = "+557388143062";

const UPSELLS: Product[] = [
  {
    id: 'upsell-1',
    name: 'Kit Carbono Profissional',
    price: 99.00,
    originalPrice: 139.90,
    description: 'Kit 3 passos de 1 litro com forte destaque visual e percepção de valor alta.',
    image: 'https://i.ibb.co/Tq4TZ6pR/Whats-App-Image-2026-03-26-at-17-33-13.jpg'
  },
  {
    id: 'upsell-2',
    name: 'Ativador de Cachos',
    price: 29.90,
    originalPrice: 39.90,
    description: 'Oferta de hoje: De R$ 39,90 por R$ 29,90',
    image: 'https://i.ibb.co/Sw3B52Lz/Whats-App-Image-2025-12-03-at-12-45-53.jpg'
  },
  {
    id: 'upsell-3',
    name: 'Alisamento de Ozônio sem tempo de pausa',
    price: 139.90,
    originalPrice: 169.00,
    description: 'Só hoje: De R$ 169,00 por R$ 139,90',
    image: 'https://i.ibb.co/wZ5SgYpY/Chat-GPT-Image-5-04-2026-16-34-03.png'
  }
];

const KIT_ITEMS = [
  {
    name: 'Kit Home Care',
    price: 59.90,
    description: 'Linha pensada para cuidado diário, percepção de marca e apresentação profissional.',
    image: 'https://i.ibb.co/cc2CCdL4/Whats-App-Image-2024-12-05-at-17-38-50-1.jpg',
    techSheet: {
      benefits: ['Cuidado diário intensivo', 'Brilho radiante', 'Fragrância exclusiva', 'Apresentação premium'],
      howToUse: 'Aplique o shampoo nos cabelos úmidos, massageie e enxágue. Repita se necessário. Aplique o condicionador, deixe agir por 3 minutos e enxágue.',
      composition: 'Queratina hidrolisada, óleos essenciais, base hidratante premium.'
    }
  },
  {
    name: 'Progressiva 300 ml',
    price: 40.00,
    description: 'Produto profissional para alinhamento dos fios e redução de volume. Base ácida profissional.',
    image: 'https://i.ibb.co/Xx3fF7xk/Chat-GPT-Image-5-04-2026-16-21-17.png',
    techSheet: {
      benefits: ['Alinhamento total dos fios', 'Redução drástica de volume', 'Brilho espelhado', 'Sem fumaça tóxica'],
      howToUse: 'Lave com shampoo de limpeza profunda. Seque 80%. Aplique o produto mecha a mecha. Deixe agir de 40 a 60 min. Enxágue 50%. Escove e pranche.',
      composition: 'Ácido Glioxílico, Blend de Aminoácidos, Óleo de Argan.'
    }
  },
  {
    name: 'Reparador de Pontas 60 ml',
    price: 30.00,
    description: 'Silicone vegetal, vitamina E e proteção térmica. Brilho e controle de frizz.',
    image: 'https://i.ibb.co/WvNcKHhW/Whats-App-Image-2024-12-05-at-17-38-51.jpg',
    techSheet: {
      benefits: ['Selagem de pontas duplas', 'Proteção térmica', 'Controle de frizz', 'Toque seco e sedoso'],
      howToUse: 'Aplique algumas gotas na palma das mãos e espalhe pelo comprimento e pontas dos cabelos secos ou úmidos.',
      composition: 'Ciclopentasiloxano, Vitamina E, Silicone Vegetal de alta performance.'
    }
  },
  {
    name: 'BB Cream / Day Shine 120 ml',
    price: 30.00,
    description: 'Finalizador multifuncional com proteção, brilho e praticidade.',
    image: 'https://i.ibb.co/kgw3bHVm/Whats-App-Image-2024-12-05-at-17-38-52.jpg',
    techSheet: {
      benefits: ['10 benefícios em 1', 'Proteção solar e térmica', 'Desembaraço imediato', 'Brilho intenso'],
      howToUse: 'Borrife sobre os cabelos úmidos ou secos a uma distância de 20cm. Finalize como desejar (secador, prancha ou natural).',
      composition: 'Pantenol, Filtro UV, Polímeros de brilho, Proteína do trigo.'
    }
  }
];

export default function App() {
  // State
  const [brandType, setBrandType] = useState<BrandType>('OUR_BRAND');
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [installments, setInstallments] = useState(1);
  const [selectedTechProduct, setSelectedTechProduct] = useState<typeof KIT_ITEMS[0] | null>(null);
  const [formData, setFormData] = useState<OrderData>({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    cep: '',
    brandName: ''
  });

  const orderSectionRef = useRef<HTMLDivElement>(null);
  const kitSectionRef = useRef<HTMLDivElement>(null);

  // Calculations
  const subtotal = useMemo(() => {
    const upsellsTotal = UPSELLS
      .filter(u => selectedUpsells.includes(u.id))
      .reduce((acc, curr) => acc + curr.price, 0);
    return MAIN_KIT_PRICE + upsellsTotal;
  }, [selectedUpsells]);

  const installmentValue = useMemo(() => {
    return subtotal / installments;
  }, [subtotal, installments]);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleUpsell = (id: string) => {
    setSelectedUpsells(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isFormValid = formData.name && formData.cpf && formData.email && formData.phone && formData.address && formData.cep;

  const generateWhatsAppMessage = () => {
    const selectedUpsellNames = UPSELLS
      .filter(u => selectedUpsells.includes(u.id))
      .map(u => `- ${u.name} — R$ ${u.price.toFixed(2).replace('.', ',')}`)
      .join('\n');

    const message = `Olá, quero concluir o pedido nº ${ORDER_NUMBER}

*Dados da cliente:*
Nome: ${formData.name}
CPF: ${formData.cpf}
E-mail: ${formData.email}
Telefone: ${formData.phone}
Endereço: ${formData.address}
CEP: ${formData.cep}

*Tipo de pedido:*
${brandType === 'OUR_BRAND' ? 'Na marca da empresa' : 'Com minha marca'}

${brandType === 'MY_BRAND' ? `*Nome da marca desejado:* \n${formData.brandName}\n` : ''}
*Itens selecionados:*
- Kit de Amostras com sua marca — R$ 159,90
${selectedUpsellNames}

*Forma de pagamento:*
${paymentMethod === 'PIX' ? 'Pix' : 'Cartão'}

*Parcelamento:*
${paymentMethod === 'CARD' ? `${installments}x de R$ ${(subtotal / installments).toFixed(2).replace('.', ',')}` : 'À vista'}

*Subtotal do pedido:*
R$ ${subtotal.toFixed(2).replace('.', ',')}

*Frete:*
A calcular

*Prazo:*
${brandType === 'OUR_BRAND' ? 'Envio em até 72 horas' : 'Produção em 7 a 15 dias'}

*Observação:*
Quero confirmar meu pedido e receber o link de pagamento.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Technical Sheet Modal */}
      <AnimatePresence>
        {selectedTechProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-premium-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-8 md:p-12 relative"
            >
              <button 
                onClick={() => setSelectedTechProduct(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-accent hover:text-white transition-all"
              >
                <ArrowRight className="rotate-180" />
              </button>

              <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="w-full md:w-1/3 aspect-square rounded-3xl overflow-hidden bg-premium-cream">
                  <img src={selectedTechProduct.image} alt={selectedTechProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-premium-black mb-2">{selectedTechProduct.name}</h3>
                  <p className="text-accent font-bold text-xl mb-4">Ficha Técnica Profissional</p>
                  <p className="text-gray-600 leading-relaxed">{selectedTechProduct.description}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Check className="text-accent" /> Benefícios Principais
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTechProduct.techSheet.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-premium-cream p-3 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Info className="text-accent" /> Modo de Uso
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
                    {selectedTechProduct.techSheet.howToUse}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-accent" /> Composição Ativa
                  </h4>
                  <p className="text-sm text-gray-500 italic">
                    {selectedTechProduct.techSheet.composition}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTechProduct(null)}
                className="btn-primary w-full mt-10"
              >
                VOLTAR PARA O PEDIDO
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Top Bar */}
      <div className="bg-premium-black text-white py-2 text-center text-xs font-medium tracking-widest uppercase">
        Oportunidade Única: Kit de Amostras Personalizado
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 bg-gradient-to-b from-white to-premium-cream">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <Star size={16} fill="currentColor" />
              <span>OFERTA EXCLUSIVA</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-premium-black leading-tight mb-6">
              KIT DE AMOSTRAS JÁ VAI COM A <span className="text-accent">SUA MARCA</span> PERSONALIZADA
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Monte hoje o seu kit inicial com produtos profissionais, prontos para receber o seu nome e começar sua marca própria com baixo investimento.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                'Personalizado com o seu nome',
                'Produção rápida e simplificada',
                'Ideal para testar e começar a vender',
                'Seu kit pronto em aproximadamente 1 semana'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="bg-accent text-white p-1 rounded-full">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => scrollTo(orderSectionRef)}
                className="btn-primary w-full sm:w-auto"
              >
                MONTAR MEU PEDIDO AGORA
              </button>
              <button 
                onClick={() => scrollTo(kitSectionRef)}
                className="btn-secondary w-full sm:w-auto"
              >
                VER O QUE VEM NO KIT
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-2xl">
              <img 
                src="https://i.ibb.co/xtqC0h7Q/Whats-App-Image-2026-04-05-at-16-04-11.jpg" 
                alt="Kit de Amostras - Comece o seu sonho" 
                className="rounded-[40px] shadow-2xl w-full h-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="mt-10 text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-block bg-white/60 backdrop-blur-md px-8 py-6 rounded-[30px] border border-accent/20 shadow-lg"
                >
                  <p className="text-2xl md:text-3xl font-bold text-premium-black leading-tight">
                    Comece o seu sonho <span className="text-accent">de forma simples.</span>
                  </p>
                  <p className="text-lg text-gray-600 mt-2 font-medium">
                    Esse é o seu primeiro passo.
                  </p>
                </motion.div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Veja como funciona na prática</h2>
            <p className="text-gray-600">Assista ao vídeo abaixo para entender todos os detalhes do seu kit e como começar sua marca.</p>
          </div>
          <div className="relative aspect-[9/16] max-w-[380px] mx-auto rounded-[40px] overflow-hidden shadow-2xl border-[12px] border-premium-black">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/qNPlDXc9exs" 
              title="Como funciona o Kit de Amostras" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-12 text-center">
            <button 
              onClick={() => scrollTo(orderSectionRef)}
              className="btn-primary"
            >
              QUERO MEU KIT AGORA
            </button>
          </div>
        </div>
      </section>

      {/* O Que Vai No Kit */}
      <section ref={kitSectionRef} className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-premium-black mb-4">O que vai dentro do seu kit de amostras</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Esse kit foi pensado para quem quer começar de forma simples, profissional e já apresentar produtos com identidade própria.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KIT_ITEMS.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-premium-cream p-6 rounded-3xl border border-gray-100 flex flex-col"
              >
                <div className="aspect-square bg-white rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                   {item.image ? (
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   ) : (
                     <Package className="text-accent/40" size={48} />
                   )}
                </div>
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-accent font-bold mb-3">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{item.description}</p>
                
                <button 
                  onClick={() => setSelectedTechProduct(item)}
                  className="w-full py-3 px-4 rounded-xl border border-accent text-accent font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Info size={14} />
                  Ficha Técnica
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-premium-black text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-accent font-bold uppercase tracking-widest text-sm mb-1">Valor Especial</p>
              <h3 className="text-3xl font-bold">TOTAL DO KIT: R$ 159,90</h3>
              <p className="text-gray-400 text-sm">O valor final do pedido será o total do kit + frete</p>
            </div>
            <button 
              onClick={() => scrollTo(orderSectionRef)}
              className="btn-primary"
            >
              MONTAR MEU PEDIDO
            </button>
          </div>
        </div>
      </section>

      {/* Prazo e Escolha da Marca */}
      <section className="py-24 px-4 bg-premium-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Você escolhe como quer receber</h2>
            <p className="text-gray-600">Personalize sua experiência de acordo com sua necessidade</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button 
              onClick={() => setBrandType('OUR_BRAND')}
              className={`p-8 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 ${brandType === 'OUR_BRAND' ? 'border-accent bg-white shadow-xl' : 'border-gray-200 bg-gray-50 opacity-70'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${brandType === 'OUR_BRAND' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'}`}>
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-xl">Receber na nossa marca</h4>
                <p className="text-gray-600 text-sm mt-1">Envio rápido para quem tem pressa</p>
                <div className="mt-4 inline-block bg-accent/10 text-accent px-3 py-1 rounded-lg font-bold text-sm">
                  Até 72 horas
                </div>
              </div>
            </button>

            <button 
              onClick={() => setBrandType('MY_BRAND')}
              className={`p-8 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 ${brandType === 'MY_BRAND' ? 'border-accent bg-white shadow-xl' : 'border-gray-200 bg-gray-50 opacity-70'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${brandType === 'MY_BRAND' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'}`}>
                <Star size={24} />
              </div>
              <div>
                <h4 className="font-bold text-xl">Sua marca personalizada</h4>
                <p className="text-gray-600 text-sm mt-1">Ideal para começar com identidade própria</p>
                <div className="mt-4 inline-block bg-accent/10 text-accent px-3 py-1 rounded-lg font-bold text-sm">
                  7 a 15 dias
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Como funciona para pedir</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: 1, title: 'Escolha o kit', desc: 'Selecione o kit base e adicione os produtos extras que desejar.' },
              { step: 2, title: 'Preencha seus dados', desc: 'Informe seus dados de contato e endereço para entrega.' },
              { step: 3, title: 'Conclua no WhatsApp', desc: 'Receba o resumo pronto e finalize o pagamento com nossa equipe.' }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <h4 className="font-bold text-xl mb-3">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-accent/20 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Montar Pedido Section */}
      <section ref={orderSectionRef} className="py-24 px-4 bg-premium-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Monte seu pedido agora</h2>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <Lock size={16} className="text-green-500" />
              <span className="text-sm font-medium text-gray-600">Ambiente 100% Seguro</span>
            </div>
          </div>

          {/* Produto Principal Fixo */}
          <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-accent mb-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center">
                <Check size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Kit de Amostras com sua marca</h4>
                <p className="text-gray-500 text-sm">Frete calculado separadamente</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-accent">R$ 159,90</span>
            </div>
          </div>

          {/* Upsells */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <ShoppingBag className="text-accent" />
              Aproveite e inclua mais opções
            </h3>
            <div className="grid gap-6">
              {UPSELLS.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => toggleUpsell(product.id)}
                  className={`group p-6 rounded-[32px] border-2 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${selectedUpsells.includes(product.id) ? 'border-accent bg-accent/5 shadow-lg' : 'border-white bg-white hover:border-gray-200 hover:shadow-md'}`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${selectedUpsells.includes(product.id) ? 'bg-accent border-accent text-white' : 'border-gray-300'}`}>
                      {selectedUpsells.includes(product.id) && <Check size={18} strokeWidth={4} />}
                    </div>
                    {product.image && (
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-premium-black uppercase text-base tracking-wide mb-1">{product.name}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed max-w-md">{product.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-1">
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-accent">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-gray-100 mb-12">
            <h3 className="text-2xl font-bold mb-8">Preencha seus dados para concluir</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nome Completo *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo" 
                  className="input-field" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">CPF *</label>
                <input 
                  type="text" 
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00" 
                  className="input-field" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">E-mail *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com" 
                  className="input-field" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Telefone *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000" 
                  className="input-field" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Endereço Completo *</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Rua, número, bairro, cidade, estado" 
                  className="input-field" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">CEP *</label>
                <input 
                  type="text" 
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  placeholder="00000-000" 
                  className="input-field" 
                />
              </div>
              
              <AnimatePresence>
                {brandType === 'MY_BRAND' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 md:col-span-2 overflow-hidden"
                  >
                    <label className="text-sm font-bold text-accent flex items-center gap-2">
                      <Star size={16} fill="currentColor" />
                      Nome que deseja colocar na marca
                    </label>
                    <input 
                      type="text" 
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      placeholder="Ex: Minha Marca Cosméticos" 
                      className="input-field border-accent/30 bg-accent/5" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Pagamento */}
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-gray-100 mb-12">
            <h3 className="text-2xl font-bold mb-8">Escolha a forma de pagamento</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => setPaymentMethod('PIX')}
                className={`p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'PIX' ? 'border-accent bg-accent/5' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'PIX' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Smartphone size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold">Pix</p>
                  <p className="text-xs text-gray-500">Pagamento à vista</p>
                </div>
              </button>

              <button 
                onClick={() => setPaymentMethod('CARD')}
                className={`p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'CARD' ? 'border-accent bg-accent/5' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'CARD' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <CreditCard size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold">Cartão de Crédito</p>
                  <p className="text-xs text-gray-500">Até 6x sem juros</p>
                </div>
              </button>
            </div>

            {paymentMethod === 'CARD' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <label className="text-sm font-bold text-gray-700">Selecione o parcelamento:</label>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button 
                    key={n}
                    onClick={() => setInstallments(n)}
                    className={`w-full p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all ${installments === n ? 'border-accent bg-accent/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <span className="font-medium">{n}x de R$ {(subtotal / n).toFixed(2).replace('.', ',')}</span>
                    <span className="text-xs font-bold text-green-600">SEM JUROS</span>
                  </button>
                ))}
              </motion.div>
            )}

            {paymentMethod === 'PIX' && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3 text-green-700">
                <Check size={20} />
                <span className="font-medium">Pagamento via Pix à vista</span>
              </div>
            )}
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-premium-black text-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShoppingBag size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold">Resumo do seu pedido</h3>
                  <p className="text-accent font-bold">Pedido nº {ORDER_NUMBER}</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                  <Clock size={16} className="text-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {brandType === 'OUR_BRAND' ? 'Envio em 72h' : 'Produção 7-15 dias'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8 border-b border-white/10 pb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Kit de Amostras com sua marca</span>
                  <span className="font-bold">R$ 159,90</span>
                </div>
                {UPSELLS.filter(u => selectedUpsells.includes(u.id)).map(u => (
                  <div key={u.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">{u.name}</span>
                    <span className="font-bold">R$ {u.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Marca Escolhida</span>
                  <span className="font-bold text-accent">{brandType === 'OUR_BRAND' ? 'Reali Professional' : 'Marca Própria'}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">Total Parcial</p>
                  <h4 className="text-4xl font-black text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</h4>
                  <p className="text-accent text-xs font-bold mt-1 flex items-center gap-1">
                    <Info size={12} />
                    FRETE SERÁ CALCULADO À PARTE
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  {!isFormValid && (
                    <p className="text-red-400 text-xs font-bold text-center">Preencha todos os dados acima</p>
                  )}
                  <button 
                    disabled={!isFormValid}
                    onClick={generateWhatsAppMessage}
                    className={`btn-primary flex items-center justify-center gap-3 !bg-whatsapp !border-none hover:scale-105 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <MessageCircle fill="white" />
                    COTAR MEU FRETE E CONCLUIR
                  </button>
                  <div className="flex items-center justify-center gap-4 opacity-60">
                    <img src="https://logodownload.org/wp-content/uploads/2014/05/correios-logo-1-1.png" alt="Correios" className="h-4 invert" referrerPolicy="no-referrer" />
                    <img src="https://jadlog.com.br/jadlog/img/logo_jadlog.png" alt="Jadlog" className="h-4 invert" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-premium-cream">
                <img 
                  src="https://i.ibb.co/sv1rN72r/Whats-App-Image-2026-02-08-at-11-28-31.jpg" 
                  alt="Miqueias Santos - Reali Professional" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-premium-black/80 to-transparent p-8 pt-20">
                  <h3 className="text-white text-2xl font-bold">Miqueias Santos</h3>
                  <p className="text-accent font-medium">@miqueiassantospro</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-gray-100 z-20">
                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <p className="font-black text-xl">100% SEGURO</p>
                  <p className="text-xs text-gray-500">Parceria Correios & Jadlog</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-premium-black mb-6 leading-tight">
                Construindo sonhos e transformando em <span className="text-accent">realidade</span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  Proprietário da <strong>Reali Professional</strong> e com mais de 13 anos de experiência na área da beleza, minha trajetória é marcada por superação e paixão pelo que faço.
                </p>
                <p>
                  De ex-entregador de pizza a empresário que hoje vende cosméticos para o Brasil inteiro, eu entendo os desafios de quem quer começar o próprio negócio.
                </p>
                <p className="italic font-medium text-premium-black">
                  "Meu objetivo não é apenas vender produtos, mas sim fornecer as ferramentas para que você também possa construir sua marca e conquistar sua independência."
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-10">
                {[
                  { title: 'Produção organizada', icon: <Package size={18} /> },
                  { title: 'Atendimento direto', icon: <MessageCircle size={18} /> },
                  { title: 'Pedido simples', icon: <Check size={18} /> },
                  { title: 'Prazo claro', icon: <Clock size={18} /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-premium-cream rounded-2xl border border-accent/5">
                    <div className="text-accent">{item.icon}</div>
                    <span className="font-bold text-sm text-premium-black">{item.title}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => scrollTo(orderSectionRef)}
                className="btn-primary mt-10 w-full sm:w-auto"
              >
                QUERO COMEÇAR COM O MIQUEIAS
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-premium-black text-white pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h4 className="text-2xl font-bold mb-6 text-accent">REALI PROFESSIONAL</h4>
              <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
                Especialistas em terceirização e personalização de cosméticos profissionais. Comece sua marca própria com quem entende do mercado.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                  <Smartphone size={18} />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                  <MessageCircle size={18} />
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-sm text-accent">Atendimento</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-accent" />
                  +55 73 8814-3062
                </li>
                <li className="flex items-center gap-2">
                  <Smartphone size={16} className="text-accent" />
                  realiprofessionalbackup@gmail.com
                </li>
                <li>Horário: Seg a Sex - 08h às 18h</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-sm text-accent">Endereço</h5>
              <p className="text-gray-400 text-sm leading-relaxed">
                Rua Lomanto Junior, 235<br />
                Bairro Pequi, Eunápolis - Bahia<br />
                CNPJ: 34.380.287/0001-44
              </p>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-medium">
            <p>© 2026 Reali Professional. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
                <Lock size={12} />
                Site Seguro
              </span>
              <span>Personalização sob consulta</span>
              <span>Frete calculado conforme CEP</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Summary Mobile */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total do Pedido</p>
            <p className="text-xl font-black text-premium-black">R$ {subtotal.toFixed(2).replace('.', ',')}</p>
          </div>
          <button 
            onClick={() => scrollTo(orderSectionRef)}
            className="btn-primary !py-3 !px-6 !text-sm"
          >
            CONCLUIR AGORA
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
