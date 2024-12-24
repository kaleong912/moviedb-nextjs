import { motion } from 'framer-motion'
import { themeColor } from '../../lib/theme'

interface TabsProps {
  activeTab: 'releasing' | 'upcoming'
  onTabChange: (tab: 'releasing' | 'upcoming') => void
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex justify-center  my-16 " >
      <TabButton
        isActive={activeTab === 'releasing'}
        onClick={() => onTabChange('releasing')}
      >
        RELEASING NOW
      </TabButton>
      <TabButton
        isActive={activeTab === 'upcoming'}
        onClick={() => onTabChange('upcoming')}
      >
        UPCOMING
      </TabButton>
    </div>
  )
}

interface TabButtonProps {
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
}

function TabButton({ isActive, onClick, children }: TabButtonProps) {
  return (
    <button
      className={`px-6 py-3  text-lg font-semibold transition-all duration-300 ease-in-out border-4 ${
        isActive ? 'shadow-lg' : ' hover:text-gray-200'
      }`}
      style={{ 
        backgroundColor: isActive ? themeColor : 'transparent',
        boxShadow: isActive ? `0 0 20px ${themeColor}` : 'none',
        borderColor: themeColor,
        color: isActive ? 'black' : themeColor,
      }}
      onClick={onClick}
    >
      {children}
      {isActive && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-1 rounded-full"
          style={{ backgroundColor: themeColor }}
          layoutId="activeTab"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  )
}

