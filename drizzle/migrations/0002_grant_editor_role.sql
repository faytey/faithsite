CREATE OR REPLACE FUNCTION public.grant_editor_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'faithroberts708@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.grant_editor_role() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS on_auth_user_created_grant_editor ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_editor AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_editor_role();
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE lower(email) = 'faithroberts708@gmail.com' ON CONFLICT DO NOTHING;