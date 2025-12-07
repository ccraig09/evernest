import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaithPreference } from '../types';
import Button from '../components/Button';
import { Sparkles } from 'lucide-react';

const Onboarding: React.FC = () => {
  const { updateProfile } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    parentNames: '',
    babyNickname: '',
    dueDate: '',
    faithPreference: FaithPreference.NON_RELIGIOUS,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    updateProfile({
      ...formData,
      hasCompletedOnboarding: true,
    });
    navigate('/today');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-md mx-auto">
      <div className="mb-8 p-4 bg-sage-100 dark:bg-sage-900 rounded-full text-sage-600 dark:text-sage-300">
        <Sparkles size={32} />
      </div>

      <h1 className="text-3xl font-serif text-sage-800 dark:text-sage-100 mb-2">
        Welcome
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
        Let's create a cozy space for you and your little one.
      </p>

      <div className="w-full bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-left text-sm font-semibold text-stone-500 mb-1">What should we call you?</label>
              <input 
                type="text" 
                placeholder="e.g. Sarah & Mike, or Mommy"
                className="w-full p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-sage-400"
                value={formData.parentNames}
                onChange={(e) => handleChange('parentNames', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-left text-sm font-semibold text-stone-500 mb-1">Baby's Nickname (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Peanut, Bean, or a Name"
                className="w-full p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-sage-400"
                value={formData.babyNickname}
                onChange={(e) => handleChange('babyNickname', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-left text-sm font-semibold text-stone-500 mb-1">Due Date (Optional)</label>
              <input 
                type="date" 
                className="w-full p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-sage-400"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
             <div>
              <label className="block text-left text-sm font-semibold text-stone-500 mb-3">Story Tone Preference</label>
              <div className="space-y-2">
                {Object.values(FaithPreference).map((faith) => (
                  <button
                    key={faith}
                    onClick={() => handleChange('faithPreference', faith)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      formData.faithPreference === faith 
                        ? 'bg-sage-50 border-sage-500 ring-1 ring-sage-500 dark:bg-sage-900/50 dark:border-sage-400' 
                        : 'bg-stone-50 border-transparent hover:bg-stone-100 dark:bg-stone-900'
                    } border`}
                  >
                    <span className="font-medium block text-stone-800 dark:text-stone-200">{faith}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          {step > 1 ? (
             <button 
               onClick={() => setStep(step - 1)}
               className="text-stone-400 hover:text-stone-600 text-sm font-semibold"
             >
               Back
             </button>
          ) : <div></div>}
          
          <Button onClick={handleNext} disabled={step === 1 && !formData.parentNames}>
             {step === 3 ? 'Start Journey' : 'Next'}
          </Button>
        </div>
      </div>
      
      {/* Progress Dots */}
      <div className="flex gap-2 mt-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i === step ? 'bg-sage-500' : 'bg-stone-300 dark:bg-stone-700'}`} />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;