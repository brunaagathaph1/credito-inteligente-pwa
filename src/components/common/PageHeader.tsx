
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  showBackButton = false,
  actions
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
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
      {actions}
      {children}
    </div>
  );
}
