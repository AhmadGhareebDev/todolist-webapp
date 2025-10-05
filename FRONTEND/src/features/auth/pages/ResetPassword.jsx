import ResetPasswordForm from "../components/ResetPasswordForm"

function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("YOUR_IMAGE_URL_HERE")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)'
        }}
      />
      
      <div className="absolute inset-0 bg-black/20 z-0" />
      
      <div className="relative z-10 w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default ResetPasswordPage;