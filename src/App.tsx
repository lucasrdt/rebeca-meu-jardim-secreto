import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Gift, Heart, Camera, ChevronRight, Menu, X, Leaf, Flower2, Download, Instagram } from 'lucide-react';
import FallingPetals from './components/FallingPetals';
import { supabase } from './lib/supabase';

// Import images
import heroImg from './assets/foto_de_inicio.jpg';
import photo1 from './assets/_MG_8025.jpg';
import photo2 from './assets/_MG_8084.jpg';
import photo3 from './assets/_MG_8111.jpg';
import photo4 from './assets/_MG_8182.jpg';
import photo5 from './assets/_MG_8221.jpg';
import photo6 from './assets/15anos.jpg';
import photo7 from './assets/_MG_8003.jpg';
import photo8 from './assets/_MG_8031.jpg';
import photo9 from './assets/_MG_8041.jpg';
import photo10 from './assets/_MG_8093.jpg';
import photo11 from './assets/_MG_8055.jpg';
import photo12 from './assets/_MG_8089.jpg';

const festaImagesRaw = import.meta.glob('./assets/festa-compressed/*.JPG', { eager: true });
const festaImages = Object.values(festaImagesRaw).map((module: any) => module.default);

const Section = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={`py-20 px-6 md:px-20 ${className}`}
  >
    {children}
  </motion.section>
);

const App: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(15);
  
  const [comments, setComments] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      setComments(data);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;
    
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { name: newName, message: newMessage }
      ])
      .select();
      
    if (!error && data) {
      setComments([data[0], ...comments]);
      setNewName('');
      setNewMessage('');
    } else {
      console.error(error);
      alert(`Erro do Banco de Dados: ${error?.message || 'Erro desconhecido'}\n\nPor favor, tire um print ou me diga qual foi esse erro!`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream text-moss selection:bg-rose/30 selection:text-moss">
      <FallingPetals />
      
      {/* Custom Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-cream/80 backdrop-blur-md border-b border-sage/20 py-4 px-6 flex justify-between items-center">
        <span className="font-serif text-2xl font-bold text-gold tracking-widest uppercase">Meu Jardim Secreto</span>
        <div className="hidden md:flex gap-8 font-medium">
          <a href="#inicio" className="hover:text-gold transition-colors">Início</a>
          <a href="#galeria" className="hover:text-gold transition-colors">Galeria</a>
          <a href="#festa" className="hover:text-gold transition-colors">A Festa</a>
          <a href="#memorias" className="hover:text-gold transition-colors">Memórias</a>
          <a href="#recados" className="hover:text-gold transition-colors">Recados</a>
          <a href="#agradecimento" className="hover:text-gold transition-colors">Agradecimento</a>
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 bg-cream flex flex-col items-center justify-center gap-8 text-2xl font-serif"
          >
            <button className="absolute top-6 right-6" onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
            <a href="#inicio" onClick={() => setIsMenuOpen(false)}>Início</a>
            <a href="#galeria" onClick={() => setIsMenuOpen(false)}>Galeria</a>
            <a href="#festa" onClick={() => setIsMenuOpen(false)}>A Festa</a>
            <a href="#memorias" onClick={() => setIsMenuOpen(false)}>Memórias</a>
            <a href="#recados" onClick={() => setIsMenuOpen(false)}>Recados</a>
            <a href="#agradecimento" onClick={() => setIsMenuOpen(false)}>Agradecimento</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for full screen image viewing */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full backdrop-blur-sm transition-all"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X size={32} />
            </button>
            
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Festa Expanded"
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl mb-8"
              onClick={(e) => e.stopPropagation()}
            />
            
            <a 
              href={selectedImage}
              download
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-medium transition-all shadow-xl"
            >
              <Download size={20} />
              Baixar Foto
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section Editorial */}
      <section id="inicio" className="relative min-h-[105vh] bg-cream flex items-center justify-center pt-24 pb-12 overflow-hidden">
        {/* Background Texture Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-serif opacity-[0.02] select-none pointer-events-none whitespace-nowrap z-0 uppercase tracking-tighter">
          Jardim
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl uppercase tracking-[0.6em] text-sage font-light mb-6"
            >
              Capa de Memórias
            </motion.span>
            
            <div className="relative">
              <h1 className="text-8xl md:text-[9.5rem] lg:text-[11rem] font-cursive text-gold leading-none lg:-ml-6 drop-shadow-sm">
                Rebeca 15
              </h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1.5 }}
                className="h-px bg-gold/30 mt-4 md:mt-8"
              />
            </div>

            <h2 className="font-serif text-3xl md:text-5xl text-moss mt-6 italic tracking-tight">
              Jardim Secreto
            </h2>
            
            <p className="max-w-md text-moss/60 leading-loose font-light mt-8 text-lg">
              Uma noite eternizada entre flores e sonhos. Bem-vindo ao registro visual de um conto de fadas real.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-12 group cursor-pointer"
              onClick={() => document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="flex items-center gap-4 text-gold font-medium uppercase tracking-widest text-sm">
                <span className="border-b border-gold/40 pb-1 group-hover:border-gold transition-all">Folhear Álbum</span>
                <div className="w-10 h-10 border border-gold/30 rounded-full flex items-center justify-center group-hover:bg-gold/5 transition-all">
                  <ChevronRight className="rotate-90 w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Decorative Frames */}
            <div className="absolute -inset-6 border border-gold/10 rounded-t-[250px] pointer-events-none hidden md:block" />
            <div className="absolute -inset-3 border border-sage/20 rounded-t-[250px] pointer-events-none hidden md:block" />
            
            {/* Botanical Elements (3D Effect) */}
            <motion.div 
              initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="absolute -top-12 -right-8 z-20 text-sage/80 drop-shadow-lg"
            >
              <Leaf size={80} strokeWidth={1} className="transform rotate-45" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, rotate: 15, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="absolute top-32 -left-12 z-20 text-rose/80 drop-shadow-lg"
            >
              <Flower2 size={90} strokeWidth={1} className="transform -rotate-12" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, rotate: -25, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-16 -right-10 z-20 text-gold/60 drop-shadow-lg"
            >
              <Leaf size={60} strokeWidth={1.5} className="transform -rotate-[135deg]" />
            </motion.div>

            <div className="relative overflow-hidden w-full max-w-[450px] aspect-[10/14] rounded-t-[250px] border-[15px] border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-white z-10">
              <motion.img 
                style={{ y: y1 }}
                src={heroImg} 
                alt="Rebeca" 
                className="w-full h-full object-cover scale-[1.2] translate-y-[-5%]" // Crop effect to hide edges
              />
              <div className="absolute inset-0 bg-gradient-to-t from-moss/10 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating Element */}
            <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
               className="absolute -bottom-10 -left-10 md:-left-20 bg-white p-6 md:p-8 rounded-2xl shadow-xl flex items-center gap-4 border border-sage/10 z-30"
            >
              <div className="w-12 h-12 bg-rose/10 rounded-full flex items-center justify-center">
                <Heart className="text-rose w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-sage font-bold">Data do Sonho</p>
                <p className="font-serif text-moss">19 Abril</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Galeria Mood */}
      <Section id="galeria" className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-moss mb-4">Galeria Mood</h2>
          <div className="h-px w-24 bg-gold mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: photo1, caption: "A magia de florescer" },
            { img: photo2, caption: "Pétalas de um sonho" },
            { img: photo3, caption: "Páginas de uma nova história" },
            { img: photo4, caption: "Um novo ciclo desabrocha" },
            { img: photo5, caption: "Brilho no olhar" },
            { img: photo6, caption: "Encanto em cada detalhe" },
            { img: photo7, caption: "Onde os sonhos moram" },
            { img: photo8, caption: "Natureza em festa" },
            { img: photo9, caption: "Jardim da juventude" },
            { img: photo10, caption: "Luzes de uma nova estação" },
            { img: photo11, caption: "Sorrisos que iluminam" },
            { img: photo12, caption: "15 primaveras" }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className={`polaroid group cursor-pointer ${index % 2 === 0 ? 'md:mt-12' : ''}`}
            >
              <div className="relative overflow-hidden mb-4 aspect-[4/5]">
                <img src={item.img} alt={`Rebeca ensaio ${index+1}`} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 border-[10px] border-white/20 pointer-events-none" />
              </div>
              <p className="font-cursive text-xl text-sage text-center">{item.caption}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Galeria da Festa */}
      <Section id="festa" className="max-w-[90rem] mx-auto mt-20">
        <div className="bg-moss/5 rounded-[3rem] border border-sage/20 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-moss mb-4">O Grande Dia</h2>
            <p className="uppercase tracking-[0.2em] text-sage text-sm font-bold mb-4">A Noite Mágica da Rebeca</p>
            <div className="h-px w-24 bg-gold mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-6 md:px-12">
            {festaImages.slice(0, visibleCount).map((imgUrl, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedImage(imgUrl)}
                className="polaroid group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-3 aspect-square">
                  <img src={imgUrl} loading="lazy" alt={`Festa ${index+1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-[6px] border-white/20 pointer-events-none" />
                  
                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm border border-white/50 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                      <Camera size={16} />
                      Ver
                    </div>
                  </div>
                </div>
                <p className="font-cursive text-lg text-sage text-center truncate px-2">A Festa</p>
              </motion.div>
            ))}
          </div>
          
          {visibleCount < festaImages.length && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 15)}
                className="px-8 py-3 bg-white border border-sage/30 text-moss font-medium rounded-full shadow-sm hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
              >
                Carregar mais fotos ({visibleCount} de {festaImages.length})
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* O Jardim Revelado (Editorial) */}
      <Section className="bg-moss/5 border-y border-sage/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 border border-gold/20 rounded-full animate-spin-slow" />
             <img src={photo1} alt="Destaque" className="w-full h-[600px] object-cover rounded-t-full border-4 border-white shadow-2xl relative z-10" />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-5xl md:text-7xl font-serif text-gold leading-tight">O Jardim <br/>Revelado</h2>
            <p className="text-xl md:text-2xl font-serif italic text-sage leading-relaxed">
              "Há flores em cada canto deste jardim, mas nenhuma brilha tanto quanto a beleza de florescer aos quinze."
            </p>
            <div className="h-0.5 w-full bg-sage/20" />
            <p className="text-moss/80 leading-loose">
              Cada pétala, cada detalhe, cada raio de sol foi pensado para celebrar o início de uma nova estação. O Jardim Secreto da Rebeca é um portal para a magia que existe em cada sonho realizado.
            </p>
          </div>
        </div>
      </Section>

      {/* A Noite do Jardim (Memórias) */}
      <Section id="memorias" className="max-w-4xl mx-auto">
        <div className="bg-white p-12 md:p-20 shadow-xl border border-sage/10 rounded-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Heart size={120} className="text-gold" />
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-gold mb-2">Memórias da Noite</h2>
            <p className="uppercase tracking-[0.2em] text-sage text-sm font-bold">Onde a mágica aconteceu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4 border border-sage/20">
                <Calendar className="text-moss" />
              </div>
              <h3 className="font-serif text-xl mb-1">Data</h3>
              <p className="text-moss/70">19 de Abril de 2026</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4 border border-sage/20">
                <Clock className="text-moss" />
              </div>
              <h3 className="font-serif text-xl mb-1">Horário</h3>
              <p className="text-moss/70">19h às 23h</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4 border border-sage/20">
                <MapPin className="text-moss" />
              </div>
              <h3 className="font-serif text-xl mb-1">Local</h3>
              <p className="text-moss/70 text-sm">Casa Veneza - Av. Joaquim Mochel, 45, Cohab IV, São Luís, MA</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <a 
              href="https://goo.gl/maps/placeholder" 
              target="_blank" 
              className="px-10 py-4 bg-moss text-cream rounded-full font-medium hover:bg-gold transition-all duration-300 shadow-lg shadow-moss/20 inline-block"
            >
              Ver no Mapa
            </a>
          </div>
        </div>
      </Section>

      {/* Livro de Assinaturas */}
      <Section id="recados" className="max-w-4xl mx-auto">
        <div className="bg-white p-8 md:p-16 rounded-3xl border border-sage/20 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5">
             <Flower2 size={200} />
          </div>
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-moss mb-4">Livro de Assinaturas</h2>
            <p className="text-sage italic font-serif text-xl">Deixe um recadinho para a Rebeca ler depois!</p>
            <div className="h-px w-24 bg-gold mx-auto mt-6" />
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-6 relative z-10 mb-16">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-moss/80 mb-2 uppercase tracking-wider">Seu Nome</label>
              <input 
                id="name"
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full px-6 py-4 bg-cream/50 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                placeholder="Como você quer ser chamado?"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-moss/80 mb-2 uppercase tracking-wider">Sua Mensagem</label>
              <textarea 
                id="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-6 py-4 bg-cream/50 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all resize-none"
                placeholder="Escreva algo especial para a Rebeca..."
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-moss text-cream rounded-xl font-medium hover:bg-gold transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Deixar Meu Recado'}
            </button>
          </form>

          <div className="space-y-6 relative z-10">
            <h3 className="text-2xl font-serif text-gold mb-8">Recados ({comments.length})</h3>
            
            {comments.length === 0 ? (
              <p className="text-center text-moss/50 italic py-8">Seja o primeiro a deixar um recado!</p>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
                {comments.map((comment) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={comment.id} 
                    className="bg-cream/30 p-6 rounded-2xl border border-sage/10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-moss text-lg">{comment.name}</h4>
                      <span className="text-xs text-moss/40">
                        {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-moss/80 leading-relaxed whitespace-pre-wrap">{comment.message}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Mensagem de Agradecimento */}
      <Section id="agradecimento" className="text-center max-w-4xl mx-auto">
        <div className="bg-rose/5 border border-rose/10 p-12 md:p-16 rounded-3xl space-y-8">
          <Heart className="mx-auto text-rose" size={40} />
          <h2 className="text-4xl md:text-5xl font-serif text-gold">Agradecimento</h2>
          <p className="text-2xl md:text-3xl font-serif italic text-moss/90 leading-relaxed max-w-3xl mx-auto">
            "Este álbum é a prova de que os momentos mais bonitos ganham vida quando estamos rodeados de quem amamos. Cada página aqui guarda um pedaço do meu coração — e um pouco de vocês também. Obrigada por terem vindo ao meu jardim."
          </p>
          <div className="h-px w-20 bg-gold mx-auto" />
          <p className="font-cursive text-4xl text-rose">Com muito carinho, Rebeca</p>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-20 bg-moss text-cream text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
           <div className="text-[30rem] font-serif absolute -bottom-20 -left-20">R</div>
        </div>
        <div className="relative z-10 space-y-8">
          <div className="font-cursive text-6xl text-gold">Rebeca</div>
          <p className="font-serif italic text-2xl text-gold/80">"Guardando cada momento no coração"</p>
          <div className="h-10 w-px bg-gold/50 mx-auto" />
          <div className="flex justify-center items-center gap-8">
            <a href="https://www.instagram.com/rebeca_alcantaras/" target="_blank" rel="noopener noreferrer" className="hover:text-gold hover:scale-110 transition-all duration-300">
              <Instagram size={28} />
            </a>
            <Camera size={28} className="cursor-pointer hover:text-gold hover:scale-110 transition-all duration-300" />
            <Heart size={28} className="cursor-pointer hover:text-rose hover:scale-110 transition-all duration-300" />
          </div>
          <p className="text-xs tracking-widest opacity-40 uppercase pt-10">© 2026 Rebeca's Secret Garden • Made with Love</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
