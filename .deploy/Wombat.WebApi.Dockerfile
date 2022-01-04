FROM mcr.microsoft.com/dotnet/aspnet:6.0

ENV ASPNETCORE_URLS=http://*:5000

COPY ./app /app
WORKDIR /app

RUN chmod +x Wombat.WebApi.dll

ENTRYPOINT ["dotnet", "Wombat.WebApi.dll"]
