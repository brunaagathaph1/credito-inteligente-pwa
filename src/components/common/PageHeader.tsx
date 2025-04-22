
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  showBackButton = false 
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    try {
      navigate(-1);
    } catch (error) {
      console.error('Error navigating back:', error);
      // Fallback to home page if there's an error
      navigate('/');
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      {showBackButton && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleBack}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
