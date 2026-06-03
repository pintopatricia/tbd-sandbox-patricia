%define name    tbdexc-native
%define version 1.0.0
%define release %{_buildnumber}

Summary: The Betfair Destination Native
Name: %{name}
Version: %{version}
Release: %{release}
Vendor: Betfair
License: SEE LICENSE IN https://developer.betfair.com/
URL: https://github.com/Flutter-Global/tbd
Group: Software
Provides: tbdexc-native
Requires: bf-fabric = 27.20.0-306
Requires: bf-tbd-http-bff-gql-v11 = 11.99.1-608
BuildArch: noarch
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root

%description
The Betfair Destination - Native

%install
# Remove previous build_root if any
rm -rf %{buildroot}
# Create /var/app/tbdexc-native folders on build_root and copy app files to it
mkdir -p %{buildroot}%{_localstatedir}/app/%{name}
cp -r %{_sourcedir}/* %{buildroot}%{_localstatedir}/app/%{name}
# Create default folder
%{__mkdir} -p %{buildroot}%{_sysconfdir}/%{name}

%files
%defattr(0644,root,root,0755)
%attr(0755,root,root) %{_localstatedir}/app/%{name}

%pre
getent group ldap_logbot > /dev/null || groupadd -r ldap_logbot -g 3000
getent passwd ldap_logbot > /dev/null || useradd -r -g ldap_logbot -d /home/ldap_logbot -s /bin/bash -c "ldap_logbot" ldap_logbot
getent group nodejs > /dev/null || groupadd -r nodejs -g 3123
getent passwd nodejs > /dev/null || useradd -r -g nodejs -d /home/nodejs -m -s /bin/bash -c "nodejs" nodejs
