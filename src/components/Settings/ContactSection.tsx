import { useState } from 'react';

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');

        // Simulação de envio
        setTimeout(() => {
            setFormStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setFormStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Grid Principal */}
            <div className="grid lg:grid-cols-3 gap-5 h-full min-h-0">
                {/* Formulário de Contato */}
                <div className="lg:col-span-2 min-h-0">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm h-full flex flex-col">
                        {/* Cabeçalho dentro do card */}
                        <div className="mb-6 flex-shrink-0 pb-6 border-b border-neutral-200">
                            <h2 className="text-4xl font-bold text-black mb-2">Contato</h2>
                            <p className="text-base text-neutral-600">Entre em contato conosco para dúvidas, suporte ou feedback</p>
                        </div>

                        <h3 className="text-xl font-bold text-black mb-5 flex-shrink-0">Envie sua mensagem</h3>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                            {/* Campos do formulário */}
                            <div className="grid md:grid-cols-2 gap-4 mb-4 flex-shrink-0">
                                <div>
                                    <label className="block text-sm font-semibold text-black mb-2">
                                        Nome completo *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 text-base border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-all"
                                        placeholder="Seu nome completo"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-black mb-2">
                                        E-mail *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 text-base border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-all"
                                        placeholder="seu@gmail.com"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 flex-shrink-0">
                                <label className="block text-sm font-semibold text-black mb-2">
                                    Assunto *
                                </label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full px-4 py-3 text-base border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-all"
                                >
                                    <option value="">Selecione um assunto</option>
                                    <option value="duvida">Dúvida</option>
                                    <option value="suporte">Suporte Técnico</option>
                                    <option value="parceria">Parceria</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            <div className="flex-1 min-h-0 mb-4 flex flex-col">
                                <label className="block text-sm font-semibold text-black mb-2 flex-shrink-0">
                                    Mensagem *
                                </label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full px-4 py-3 text-base border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-all resize-none flex-1"
                                    placeholder="Como podemos ajudar você?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formStatus === 'sending'}
                                className="w-full py-3.5 bg-black text-white text-base font-semibold rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
                            >
                                {formStatus === 'sending' ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Enviando...
                                    </>
                                ) : formStatus === 'success' ? (
                                    <>
                                        <i className="fas fa-check"></i>
                                        Mensagem enviada!
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i>
                                        Enviar mensagem
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Informações de Contato */}
                <div className="flex flex-col gap-5">
                    {/* E-mail */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-envelope text-white text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-black">E-mail</h3>
                        </div>
                        <a 
                            href="mailto:kuboprofessional@gmail.com"
                            className="text-base font-medium text-black hover:text-neutral-600 transition-colors break-all"
                        >
                            kuboprofessional@gmail.com
                        </a>
                    </div>

                    {/* Endereço */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-location-dot text-white text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-black">Endereço</h3>
                        </div>
                        <p className="text-base font-medium text-black mb-1">Brasília, DF</p>
                        <p className="text-sm text-neutral-600">Brasil</p>
                    </div>
                </div>
            </div>
        </div>
    );
}