from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class CustomUser(AbstractUser):
    
    @property
    def full_name(self) -> str:
        "Returns the user's full name."
        return f'{self.first_name} {self.last_name}'.strip()
